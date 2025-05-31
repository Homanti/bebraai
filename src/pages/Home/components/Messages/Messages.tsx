import {AnimatePresence, motion} from "motion/react";
import styles from "./Messages.module.scss";
import { useEffect } from "react";
import { messagesEndRef, scrollToBottom } from "../../../../utils/scrollToBottom.tsx";
import { MarkdownRenderer } from "./MarkdownRenderer.tsx";

type MessagesProps = {
    activeChat: {
        messages: {
            content?: string;
            files?: { id: string; data: string }[];
            role: 'user' | 'assistant';
        }[];
    };
}

const Messages = ({ activeChat }: MessagesProps) => {
    useEffect(() => {
        scrollToBottom();
    }, [activeChat?.messages]);

    return (
        <div className={styles.messages}>
            <AnimatePresence>
                {activeChat.messages.map((message, index) => {
                    const isUser = message.role === 'user';
                    const motionProps = {
                        initial: { opacity: 0, x: isUser ? -100 : 100 },
                        animate: { opacity: 1, x: 0 },
                        exit: { opacity: 0, x: isUser ? -100 : 100 },
                    };

                    return (
                        <div className={styles.messageContainer} key={index} aria-live={message.role === 'assistant' ? 'polite' : 'off'}>
                            {message.files?.map((item, fileIndex) => (
                                <motion.div
                                    className={styles.imageMessage}
                                    key={`file-${index}-${fileIndex}`}
                                    {...motionProps}
                                >
                                    {item.data.startsWith("data:image") ? (
                                        <img src={item.data} alt="image message" />
                                    ) : (
                                        <pre>{item.data}</pre>
                                    )}
                                </motion.div>
                            ))}

                            {message.content && (
                                <motion.div
                                    key={`text-${index}`}
                                    className={`${styles.message} ${message.role === 'assistant' ? styles.incoming : ''}`}
                                    {...motionProps}
                                >
                                    <MarkdownRenderer content={message.content} />
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </AnimatePresence>
            <div aria-hidden={true} style={{opacity: 0}} ref={messagesEndRef}>.</div>
        </div>
    )
}

export default Messages;