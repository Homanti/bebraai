import styles from './PromptForm.module.scss';
import { useEffect, useRef, useState } from "react";
import {Send, Plus, X, Brush, Globe, File as Document, Mic} from "lucide-react";
import SvgButton from "../../../../components/SvgButton/SvgButton.tsx";
import type {Message, MessageFile} from "../../../../types/chat.tsx";
import { AnimatePresence, motion } from "motion/react";
import { useSettingsStore } from "../../../../store/settings.tsx";
import { models } from "../../../../data/models.tsx";
import { useMessageStore } from "../../../../store/messages.tsx";
import { useTranslation } from "react-i18next";
import { useImageViewerStore } from "../../../../store/imageviewer.tsx";
import {transcriptAudio, uploadFile} from "../../../../api/messages.tsx";
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
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        let value = inputValue;

        let remainingFiles: MessageFile[] = [];

        if (message.files && message.files.length > 0) {
            let newValue = value;

            remainingFiles = [];

            for (const file of message.files) {
                if (file.file_content && file.file_name) {
                    const extension = file.file_name.split('.').pop()?.toLowerCase() || '';
                    newValue += `\n\`\`\`${extension} filename="${file.file_name}"\n${file.file_content}\n\`\`\``;
                } else {
                    remainingFiles.push(file);
                }
            }

            value = newValue;
        }

        const trimmed = value.trim();

        if (trimmed.length === 0 && remainingFiles.length === 0) return;

        const newMessage: Message = {
            ...message,
            content: trimmed,
            files: remainingFiles,
        };

        onSubmit(newMessage, setFormIsDisabled);
        setInputValue('');
        resetMessage();
    };

    const processFiles = async (
        files: File[] | DataTransferItem[],
    ) => {
        if (!models.find((m) => m.name === modelName.modelName && m.provider === modelName.providerName)?.visionSupport) return;

        if ((message.files && message.files?.length > 10) || files.length > 10) return alert(t('error.max_files_exceeded'));

        const validFiles: MessageFile[] = [];

        const readTextFile = (file: File): Promise<MessageFile> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve({ id: `${Date.now()}-${Math.random()}`, file_content: reader.result as string, file_name: file.name, file_url: undefined });
                };
                reader.onerror = reject;
                reader.readAsText(file);
            });
        };

        const allowedTextExtensions = [
            '.txt', '.md', '.json', '.yaml', '.yml', '.xml', '.csv', '.tsv',
            '.js', '.ts', '.jsx', '.tsx', '.py', '.cpp', '.c', '.h', '.hpp',
            '.java', '.kt', '.scala', '.rb', '.php', '.sh', '.go', '.rs',
            '.css', '.scss', '.less', '.html', '.htm', '.env', '.toml',
            '.sql', '.log', '.conf', '.cfg', '.ini', '.tex'
        ];

        for (const item of files) {
            let file: File | null = null;

            if (item instanceof File) {
                file = item;
            } else if ('getAsFile' in item && typeof item.getAsFile === 'function') {
                file = item.getAsFile();
            }

            if (!file) continue;

            const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

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
                } else if (item.type.startsWith('text/') || item.type === 'application/json' || allowedTextExtensions.includes(fileExtension)) {
                    try {
                        const result = await readTextFile(item);
                        validFiles.push(result);
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
            const updatedFiles = [...(message.files ?? []), ...validFiles];
            setMessage({ files: updatedFiles });
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

        await processFiles(files);
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

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream, {
                mimeType: "audio/webm;codecs=opus"
            });

            setIsRecording(true);
            setFormIsDisabled(true);
            setMediaStream(stream);

            recorder.ondataavailable = async (event) => {
                if (event.data.size > 0) {
                    const file = new File([event.data], 'recording.webm', { type: 'audio/webm' });

                    try {
                        const text = await transcriptAudio(file);
                        setInputValue((prev) => prev + (prev ? '\n' : '') + text);
                    } catch (err) {
                        console.error(err);
                    } finally {
                        setFormIsDisabled(false);
                        setIsRecording(false);
                    }
                }
            };

            recorder.start();
            setMediaRecorder(recorder);
        } catch (err) {
            console.error(err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
        }
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
                                    item.file_url ? (
                                        <motion.div
                                            key={item.id}
                                            className={styles.previewImgItem}
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
                                    ) : (
                                        item.file_content && (
                                            <motion.div
                                                key={item.id}
                                                className={styles.previewItem}
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
                                                    <div className={styles.itemContent}>
                                                        <span className={styles.itemContent__icon}>
                                                            <Document />
                                                        </span>
                                                        {item.file_name}
                                                    </div>
                                                </>
                                            </motion.div>
                                        )
                                    )
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
                        <label className={`${styles.addButton} ${!((models.find((m) => m.name === modelName.modelName && m.provider === modelName.providerName)?.visionSupport) && !(message.draw) && !(message.web_search)) ? styles.disabled : ''}`} aria-label={t('aria.button_add_files')} title={t('aria.button_add_files')}>
                            <Plus />
                            <input
                                disabled={!models.find((m) => m.name === modelName.modelName && m.provider === modelName.providerName)?.visionSupport || message.draw}
                                type="file"
                                accept="
                                    image/png,image/jpeg,.jpeg,.bmp,.webp,.svg,
                                    .txt,.md,.rtf,.log,
                                    .json,.yaml,.yml,.ini,.toml,.csv,.tsv,
                                    .xml,.html,.htm,.xhtml,
                                    .js,.jsx,.ts,.tsx,
                                    .c,.cpp,.h,.hpp,.cs,
                                    .java,.kt,.kts,.scala,
                                    .py,.ipynb,
                                    .rb,.php,.pl,.sh,.bash,.zsh,
                                    .go,.rs,.dart,.swift,.m,.mm,
                                    .sql,.db,.sqlite,
                                    .css,.scss,.sass,.less,
                                    .bat,.cmd,.ps1,.vb,.vbs,.lua,
                                    .tex,.bib,
                                    .cfg,.conf,.env,.rc
                                  "
                                multiple
                                style={{ display: 'none' }}
                                onChange={handleFileAdd}
                            />
                        </label>

                        <SvgButton
                            className={`${styles.toolButton} ${message.draw ? styles.active : ''}`}
                            onClick={() => toggleMode('draw')}
                            aria-label={t('aria.button_drawing_mode')}
                            title={t('aria.button_drawing_mode')}
                            role={"switch"}
                            aria-pressed={message.draw ? 'true' : 'false'}
                        >
                            <Brush />
                        </SvgButton>

                        <SvgButton
                            className={`${styles.toolButton} ${message.web_search ? styles.active : ''}`}
                            onClick={() => toggleMode('web_search')}
                            aria-label={t('aria.button_web_search')}
                            title={t('aria.button_web_search')}
                            role={"switch"}
                            aria-pressed={message.web_search ? 'true' : 'false'}
                        >
                            <Globe />
                        </SvgButton>
                    </div>

                    <div className={styles.toolbarButtons}>
                        <SvgButton
                            className={`${styles.toolButton} ${isRecording ? styles.active : ''}`}
                            aria-label={t('aria.button_voice_message')}
                            title={t('aria.button_voice_message')}
                            onClick={() => {
                                if (isRecording) {
                                    stopRecording();
                                } else {
                                    startRecording();
                                }
                            }}
                        >
                            <Mic />
                        </SvgButton>
                        <SvgButton
                            type="submit"
                            className={`${styles.toolButton} ${styles.active}`}
                            disabled={formIsDisabled || (!inputValue.trim() && !(message.files?.length && message.files.length > 0))}
                            aria-label={t('aria.button_send_message')}
                            title={t('aria.button_send_message')}
                        >
                            <Send />
                        </SvgButton>
                    </div>
                </div>
            </form>
        </div>
    )
};

export default PromptForm;