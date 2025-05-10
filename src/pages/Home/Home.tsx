import styles from './Home.module.scss';
import PromptForm from './components/PromptForm/PromptForm.tsx';
import {useEffect, useRef, useState} from "react";
import { motion, AnimatePresence } from "motion/react";
import {sendMessage} from "../../api/messages.tsx";

type Message = {
    text: string;
    from: 'user' | 'assistant';
}

const Home = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const submitMessage = async (message: string) => {
        addNewMessage(message);
        const response = await sendMessage(message);
        addNewMessage(response, 'assistant');
    }

    const addNewMessage = (text: string, from: "user" | "assistant" = "user"): void => {
        setMessages(prev => {
            const updatedMessages = [...prev, { text, from }];
            localStorage.setItem('messages', JSON.stringify(updatedMessages));
            return updatedMessages;
        });
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const saved = localStorage.getItem('messages');
        if (saved) {
            setMessages(JSON.parse(saved));
        }
    }, []);

    return (
        <>
            <main>
                <section className={styles.chat}>
                    <AnimatePresence>
                        {messages.length === 0 && (
                            <motion.h1
                                className={styles.title}
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                            >
                                Hey! Write your question.
                            </motion.h1>
                        )}
                    </AnimatePresence>
                    <div className={styles.messages}>
                        <AnimatePresence>
                            {
                            messages.map((message, index) => (
                                    <motion.div
                                        key={index}
                                        className={`${styles.message} ${message.from === 'assistant' ? styles.incoming : ''}`}
                                        initial={message.from === 'user' ? { opacity: 0, x: -100 } : { opacity: 0, x: 100 }}
                                        animate={message.from === 'user' ? { opacity: 1, x: 0 }: { opacity: 1, x: 0 }}
                                        exit={message.from === 'user' ? { opacity: 0, x: -100 }: { opacity: 0, x: 100 }}
                                    >
                                        <p className={styles.messageText}>{message.text}</p>
                                    </motion.div>
                            ))
                            }
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>
                </section>
                <section className={`${styles.prompt} ${styles.gradientBorder}`}>
                    <PromptForm onSubmit={submitMessage} />
                </section>
            </main>
        </>
    );
}

export default Home;