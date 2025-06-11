import styles from './PromptForm.module.scss';
import { useEffect, useRef, useState } from "react";
import {Send, Plus, X, Brush} from "lucide-react";
import SvgButton from "../../../../components/SvgButton/SvgButton.tsx";
import type {Message, MessageFile} from "../../../../types/chat.tsx";
import { AnimatePresence, motion } from "motion/react";
import { useSettingsStore } from "../../../../store/settings.tsx";
import { models } from "../../../../data/models.tsx";
import { useMessageStore } from "../../../../store/messages.tsx";
import { useTranslation } from "react-i18next";
import { useImageViewerStore } from "../../../../store/imageviewer.tsx";
import {uploadFile} from "../../../../api/messages.tsx";
import ImageWithLoader from "../../../../components/ImageWithLoader/ImageWithLoader.tsx";

type Modes = {
    draw: boolean;
    web_search: boolean;
};

const PromptForm = ({ onSubmit }: { onSubmit: (message: Message, setFormIsDisabled: (disabled: boolean) => void) => void }) => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState<string>('');
    const [inputFocused, setInputFocused] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);
    const { modelName } = useSettingsStore();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const message = useMessageStore(state => state.message);
    const setMessage = useMessageStore(state => state.setMessage);
    const resetMessage = useMessageStore(state => state.resetMessage);
    const [isDragOver, setIsDragOver] = useState(false);
    const [formIsDisabled, setFormIsDisabled] = useState(false);
    const { setImageViewer } = useImageViewerStore();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        const trimmed = inputValue.trim();

        if (trimmed.length === 0 && (!message.files || message.files.length === 0)) return;

        message.content = trimmed;
        onSubmit(message, setFormIsDisabled);
        setInputValue('');
        resetMessage();
    };

    const processFiles = async (
        files: File[] | DataTransferItem[],
    ) => {
        if (!models.find((m) => m.name === modelName)?.visionSupport) return;

        if ((message.files && message.files?.length > 10) || files.length > 10) return alert(t('error.max_files_exceeded'));

        const validFiles: MessageFile[] = [];

        for (const item of files) {
            if (item instanceof File) {
                if (item.type.startsWith('image/')) {
                    try {
                        setFormIsDisabled(true);
                        const url = await uploadFile(item);
                        validFiles.push({ id: `${Date.now()}-${validFiles.length}`, file_url: url });
                    } catch (err) {
                        console.error(err);
                        alert(t('error.file_upload_failed'));
                    }
                }
            } else {
                const file = item.getAsFile();
                if (file && file.type.startsWith('image/')) {
                    try {
                        setFormIsDisabled(true);
                        const url = await uploadFile(file);
                        validFiles.push({ id: `${Date.now()}-${validFiles.length}`, file_url: url });
                    } catch (err) {
                        console.error(err);
                        alert(t('error.file_upload_failed'));
                    }
                }
            }
        }

        if (validFiles.length === 0) return;

        const totalFiles = (message.files?.length || 0) + validFiles.length;
        if (totalFiles > 10) {
            return alert(t('error.max_files_exceeded'));
        }

        try {
            setMessage({ files: [...(message.files ?? []), ...validFiles] });
        } catch (err) {
            console.error(err);
            alert(t('file_upload_failed'));
        } finally {
            setFormIsDisabled(false);
        }
    };

    const handleFileAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            await processFiles(Array.from(e.target.files));
        }
    };

    const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = Array.from(e.clipboardData.items);
        const hasImage = items.some(item => item.type.startsWith("image/"));

        if (hasImage) {
            e.preventDefault();
            await processFiles(items);
        }
    };

    const handleDrop = async (e: React.DragEvent<HTMLFormElement>) => {
        e.preventDefault();

        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith("image/"));

        if (imageFiles.length === 0) {
            return;
        }

        await processFiles(imageFiles);
    };

    const handleDeleteContent = (idToDelete: string) => {
        setMessage({ files: message.files?.filter(item => item.id !== idToDelete) ?? [] });
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight: number = Math.min(textarea.scrollHeight, 200);
            textarea.style.height = scrollHeight + 'px';
        }
    }, [inputValue]);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMode = (key: keyof Modes) => {
        const isActive = message[key];
        setMessage({
            draw: key === 'draw' ? !isActive : false,
            web_search: key === 'web_search' ? !isActive : false,
        });
    };

    return (
        <div className={`${styles.container} ${inputFocused ? styles.focused : ''}`}
             onMouseDown={(e) => {
                 const target = e.target as HTMLElement;
                 if (target.closest('button, input, textarea, label, img, [tabindex], [role="button"]')) return;
                 textareaRef.current?.focus();
                 e.preventDefault();
             }}>

            <form className={styles.form} onSubmit={handleSubmit}
                  onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                  }}
                  onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                  }}
                  onDrop={async (e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      await handleDrop(e);
                  }}
                  onDragEnter={(e) => e.preventDefault()}
            >
                <AnimatePresence>
                    {isDragOver && (
                        <motion.div
                            className={styles.dropzone}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h1>{t('drag_files_here')}</h1>
                        </motion.div>
                    )}
                </AnimatePresence>

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
                                        <>
                                            <SvgButton
                                                className={styles.deleteButton}
                                                onClick={() => handleDeleteContent(item.id)}
                                            >
                                                <X />
                                            </SvgButton>
                                            <ImageWithLoader
                                                src={item.file_url}
                                                alt="preview"
                                                className={styles.imagePreview}
                                                onClick={() => { setImageViewer(true, item.file_url) }}
                                            />
                                        </>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={styles.inputContainer}>
                    <textarea
                        className={styles.textarea}
                        placeholder={t('prompt_placeholder')}
                        value={inputValue}
                        ref={textareaRef}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        onChange={(e) => setInputValue(e.currentTarget.value)}
                        onPaste={handlePaste}
                        onKeyDown={(e) => {
                            if (width <= 768) {
                                return;
                            }

                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (formIsDisabled) return;
                                handleSubmit(e);
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
                </div>

                <div className={styles.toolbar}>
                    <div className={styles.toolbarButtons}>
                        <label className={`${styles.addButton} ${!((models.find((m) => m.name === modelName)?.visionSupport) && !(message.draw)) ? styles.disabled : ''}`} aria-label={t('aria.button_add_files')}>
                            <Plus />
                            <input
                                disabled={!models.find((m) => m.name === modelName)?.visionSupport || message.draw}
                                type="file"
                                accept="image/png, image/jpeg"
                                multiple
                                style={{ display: 'none' }}
                                onChange={handleFileAdd}
                            />
                        </label>

                        <SvgButton
                            className={`${styles.toolButton} ${message.draw ? styles.active : ''}`}
                            onClick={() => toggleMode('draw')}
                        >
                            <Brush />
                        </SvgButton>

                        {/*<SvgButton*/}
                        {/*    className={`${styles.toolButton} ${message.web_search ? styles.active : ''}`}*/}
                        {/*    onClick={() => toggleMode('web_search')}*/}
                        {/*>*/}
                        {/*    <Globe />*/}
                        {/*</SvgButton>*/}
                    </div>

                    <SvgButton
                        type="submit"
                        className={styles.sendButton}
                        disabled={formIsDisabled || (!inputValue.trim() && !(message.files?.length && message.files.length > 0))}
                        aria-label={t('aria.button_send_message')}
                    >
                        <Send />
                    </SvgButton>
                </div>
            </form>
        </div>
    )
};

export default PromptForm;