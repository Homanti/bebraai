import styles from './PromptForm.module.scss';
import { useState } from "react";
import { Send, Plus, X } from "lucide-react";
import { isMobile } from "react-device-detect";
import SvgButton from "../../../../components/SvgButton/SvgButton.tsx";
import type {Message} from "../../../../types/chat.tsx";
import {AnimatePresence, motion} from "motion/react";

const PromptForm = ({ onSubmit }: { onSubmit: (message: Message) => void }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [inputFocused, setInputFocused] = useState(false);
    const [message, setMessage] = useState<Message>({
        content: '',
        files: [],
        role: 'user'
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = inputValue.trim();

        if (!trimmed && !message.files) return;

        message.content = trimmed;

        onSubmit(message);
        setInputValue('');
        setMessage({
            content: '',
            files: [],
            role: 'user'
        });
    }

    const handleFileAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        if (files.length > 10) return alert('You can only upload up to 10 files at a time');

        const readFile = (file: File) =>
            new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const content = event.target?.result;
                    if (typeof content === 'string') {
                        resolve(content);
                    } else {
                        reject('Failed to read file');
                    }
                };
                reader.onerror = () => reject('Error reading file');
                reader.readAsDataURL(file);
            });

        try {
            const contents = await Promise.all(Array.from(files).map(readFile));
            const withIds = contents.map((data, i) => ({
                id: `${Date.now()}-${i}`,
                data
            }));

            setMessage(prev => ({
                ...prev,
                files: [...(prev.files ?? []), ...withIds]
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteContent = (idToDelete: string) => {
        setMessage(prev => ({
            ...prev,
            files: prev.files?.filter(item => item.id !== idToDelete) ?? []
        }));
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = e.clipboardData.items;
        const imageItems: DataTransferItem[] = [];

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                imageItems.push(items[i]);
            }
        }

        if (imageItems.length > 0) {
            e.preventDefault();

            const readImages = imageItems.map((item, i) => {
                const file = item.getAsFile();
                return new Promise<{ id: string; data: string }>((resolve, reject) => {
                    if (!file) return reject('No file found');
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const content = event.target?.result;
                        if (typeof content === 'string') {
                            resolve({ id: `${Date.now()}-${i}`, data: content });
                        } else {
                            reject('Failed to read file');
                        }
                    };
                    reader.onerror = () => reject('Error reading file');
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(readImages)
                .then(results => {
                    setMessage(prev => ({
                        ...prev,
                        files: [...(prev.files ?? []), ...results]
                    }));
                })
                .catch(err => console.error(err));
        }
    };

    return (
        <div className={`${styles.container} ${inputFocused ? styles.focused : ''}`}>

            <form className={styles.form} onSubmit={handleSubmit}>
                <AnimatePresence>
                    {(message.files ?? []).length > 0 && (
                        <motion.div
                            className={styles.contentContainer}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 100 }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <AnimatePresence mode="popLayout">
                                {message.files?.map(item => (
                                    <motion.div
                                        key={item.id}
                                        className={styles.contentItem}
                                        layout
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        {item.data.startsWith("data:image") ? (
                                            <>
                                                <SvgButton
                                                    className={styles.deleteButton}
                                                    onClick={() => handleDeleteContent(item.id)}
                                                >
                                                    <X />
                                                </SvgButton>
                                                <img src={item.data} alt="preview" className={styles.imagePreview} />
                                            </>
                                        ) : (
                                            <pre>{item.data}</pre>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={styles.inputContainer}>
                    <label className={styles.addButton}>
                        <Plus />
                        <input type="file" maxLength={10} accept="image/png, image/jpeg" multiple style={{ display: 'none' }} onChange={handleFileAdd} />
                    </label>

                    <textarea
                        className={styles.textarea}
                        placeholder="Write your prompt"
                        value={inputValue}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        onChange={(e) => setInputValue(e.currentTarget.value)}
                        onPaste={handlePaste}
                        onKeyDown={(e) => {
                            if (isMobile) {
                                return;
                            }

                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                const trimmed = inputValue.trim();

                                if (trimmed || (message.files?.length && message.files?.length > 0)) {
                                    message.content = trimmed;

                                    onSubmit(message);
                                    setInputValue('');
                                    setMessage({
                                        content: '',
                                        files: [],
                                        role: 'user'
                                    });
                                }
                            }

                            if (e.key === 'Enter' && e.shiftKey) {
                                const { selectionStart, selectionEnd } = e.currentTarget;
                                const newValue =
                                    inputValue.substring(0, selectionStart) +
                                    '\n' +
                                    inputValue.substring(selectionEnd);
                                setInputValue(newValue);
                                requestAnimationFrame(() => {
                                    const textarea = e.currentTarget;
                                    textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
                                });
                                e.preventDefault();
                            }
                        }}
                    />
                    <SvgButton type="submit" className={styles.sendButton} disabled={!inputValue.trim() && !(message.files?.length && message.files.length > 0)}>
                        <Send />
                    </SvgButton>
                </div>
            </form>
        </div>
    )
}

export default PromptForm;