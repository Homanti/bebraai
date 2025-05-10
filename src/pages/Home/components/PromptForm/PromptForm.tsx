import styles from './PromptForm.module.scss';
import { useState } from "react";
import { Send } from "lucide-react";
import { isMobile } from "react-device-detect";

const PromptForm = ({ onSubmit }: { onSubmit: (msg: string) => void }) => {
    const [inputValue, setInputValue] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = inputValue.trim();

        if (!trimmed) return;

        onSubmit(trimmed);
        setInputValue('');
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <textarea
                    className={styles.textarea}
                    placeholder="Write your prompt"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.currentTarget.value)}
                    onKeyDown={(e) => {
                        if (isMobile) {
                            return;
                        }

                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            const trimmed = inputValue.trim();
                            if (trimmed) {
                                onSubmit(trimmed);
                                setInputValue('');
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
                <button className={styles.button} type="submit">
                    <Send />
                </button>
            </form>
        </div>
    )
}

export default PromptForm;