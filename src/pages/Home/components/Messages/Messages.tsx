import {AnimatePresence, motion} from "motion/react";
import styles from "./Messages.module.scss";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useEffect } from "react";
import { messagesEndRef, scrollToBottom } from "../../../../utils/scrollToBottom.tsx";

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
                {activeChat.messages.map((message, index) => (
                    <>
                        {message.content ? (
                            <>
                                {message.files?.map((item, index) => (
                                    <motion.div
                                        className={styles.imageMessage}
                                        key={index}
                                        initial={message.role === 'user' ? { opacity: 0, x: -100 } : { opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={message.role === 'user' ? { opacity: 0, x: -100 } : { opacity: 0, x: 100 }}
                                    >
                                        {item.data.startsWith("data:image") ? (
                                            <>
                                                <img src={item.data} alt="image message" />
                                            </>
                                        ) : (
                                            <pre>{item.data}</pre>
                                        )}
                                    </motion.div>
                                ))}

                                <motion.div
                                    key={index}
                                    className={`${styles.message} ${message.role === 'assistant' ? styles.incoming : ''}`}
                                    initial={message.role === 'user' ? { opacity: 0, x: -100 } : { opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={message.role === 'user' ? { opacity: 0, x: -100 } : { opacity: 0, x: 100 }}>

                                    <ReactMarkdown
                                        remarkPlugins={[remarkMath]}
                                        rehypePlugins={[rehypeKatex]}>
                                        {message.content}
                                    </ReactMarkdown>
                                </motion.div>
                            </>
                        ) : (
                            <>
                                {message.files?.map((item, index) => (
                                    <motion.div className={styles.imageMessage}
                                                key={index}
                                                initial={message.role === 'user' ? { opacity: 0, x: -100 } : { opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={message.role === 'user' ? { opacity: 0, x: -100 } : { opacity: 0, x: 100 }}>
                                        {item.data.startsWith("data:image") ? (
                                            <>
                                                <img src={item.data} alt="image message" />
                                            </>
                                        ) : (
                                            <pre>{item.data}</pre>
                                        )}
                                    </motion.div>
                                ))}
                            </>
                        )}
                    </>
                ))}
            </AnimatePresence>
            <div style={{opacity: 0}} ref={messagesEndRef}>.</div>
        </div>
    )
}

export default Messages;