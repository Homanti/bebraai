import styles from './Home.module.scss';
import PromptForm from './components/PromptForm/PromptForm.tsx';
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { sendMessage } from "../../api/messages.tsx";
import ReactMarkdown from 'react-markdown';
import type { Message, Chat } from "../../types/chat.tsx";
import { getChats, saveChats } from "../../utils/chatsStorage.tsx";
import { Trash, Menu } from "lucide-react";
import SvgButton from "../../components/SvgButton/SvgButton.tsx";
import 'katex/dist/katex.min.css';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const Home = () => {
    const [chats, setChats] = useState<Chat[]>(getChats());
    const [activeChatId, setActiveChatId] = useState(() => {
        const existing = getChats();
        if (existing.length > 0) return existing[0].id;
        const defaultChat: Chat = { id: '1', title: 'New chat', messages: [] };
        saveChats([defaultChat]);
        return '1';
    });
    const [width, setWidth] = useState(window.innerWidth);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const activeChat = chats.find(c => c.id === activeChatId)!;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const updateChats = (updated: Chat[]) => {
        setChats(updated);
        saveChats(updated);
    };

    const updateActiveChatMessages = (newMessages: Message[]) => {
        const updatedChats = chats.map(chat =>
            chat.id === activeChatId
                ? {
                    ...chat,
                    messages: newMessages,
                    title: chat.title === 'New chat' && newMessages.length > 0
                        ? newMessages[0].content.slice(0, 50)
                        : chat.title
                }
                : chat
        );
        updateChats(updatedChats);
    };

    const submitMessage = async (content: string) => {
        const userMessage: Message = { content, role: 'user' };
        const updatedUserMessages = [...activeChat.messages, userMessage];

        updateActiveChatMessages(updatedUserMessages);
        scrollToBottom();

        let assistantText = '';
        let currentMessages = [...updatedUserMessages];
        let assistantAdded = false;

        await sendMessage(currentMessages, (chunk: string) => {
            assistantText += chunk;

            const updatedMessages = [...currentMessages];

            if (!assistantAdded) {
                updatedMessages.push({
                    content: assistantText,
                    role: 'assistant',
                });
                assistantAdded = true;
            } else {
                updatedMessages[updatedMessages.length - 1] = {
                    content: assistantText,
                    role: 'assistant',
                };
            }

            updateActiveChatMessages(updatedMessages);
            currentMessages = updatedMessages;
        });
    };

    const createNewChat = () => {
        const nextId = (Math.max(...chats.map(c => Number(c.id)), 0) + 1).toString();
        const newChat: Chat = {
            id: nextId,
            title: 'New chat',
            messages: [],
        };
        const newChats = [...chats, newChat];
        updateChats(newChats);
        setActiveChatId(newChat.id);
    };

    const deleteChat = (id: string) => {
        if (chats.length === 1) {
            const defaultChat: Chat = { id: '1', title: 'New chat', messages: [] };
            updateChats([defaultChat]);
            setActiveChatId('1');
            return;
        }

        const remainingChats = chats.filter(chat => chat.id !== id);
        updateChats(remainingChats);
        if (activeChatId === id) {
            setActiveChatId(remainingChats.length > 0 ? remainingChats[0].id : '');
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChat?.messages]);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <main>
                {width > 768 ? (
                    <nav className={styles.sidebar}>
                        <button className={styles.button} onClick={createNewChat}>+ New Chat</button>
                        <ul>
                            {[...chats].reverse().map(chat => (
                                <li
                                    key={chat.id}
                                    className={chat.id === activeChatId ? styles.active : ''}
                                    onClick={() => setActiveChatId(chat.id)}
                                >
                                    <span>{chat.title || 'New chat'}</span>
                                    <SvgButton onClick={() => deleteChat(chat.id)}>
                                        <Trash />
                                    </SvgButton>

                                </li>
                            ))}
                        </ul>
                    </nav>
                ) : (
                    <>
                        <header>
                            <SvgButton
                                onClick={() => setIsSidebarOpen(prev => !prev)}
                                className={styles.SidebarButton}>
                                <Menu />
                            </SvgButton>
                        </header>
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.nav
                                    className={styles.sidebar}
                                    initial={{x: -300}}
                                    animate={{x: 0}}
                                    exit={{x: -300}}
                                >
                                    <button className={styles.button} onClick={createNewChat}>+ New Chat</button>
                                    <ul>
                                        {chats.map(chat => (
                                            <li
                                                key={chat.id}
                                                className={chat.id === activeChatId ? styles.active : ''}
                                                onClick={() => setActiveChatId(chat.id)}
                                            >
                                                <span>{chat.title || 'New chat'}</span>
                                                <SvgButton onClick={() => deleteChat(chat.id)}>
                                                    <Trash />
                                                </SvgButton>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.nav>
                            )}
                        </AnimatePresence>
                    </>
                )}

                <section className={styles.chat}>
                    <AnimatePresence>
                        {activeChat.messages.length === 0 && (
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
                            {activeChat.messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    className={`${styles.message} ${message.role === 'assistant' ? styles.incoming : ''}`}
                                    initial={message.role === 'user' ? { opacity: 0, x: -100 } : { opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={message.role === 'user' ? { opacity: 0, x: -100 } : { opacity: 0, x: 100 }}
                                >
                                    <ReactMarkdown
                                        remarkPlugins={[remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >{message.content}</ReactMarkdown>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div style={{opacity: 0}} ref={messagesEndRef}>.</div>
                    </div>

                    <div className={`${styles.prompt} ${styles.gradientBorder}`}>
                        <PromptForm onSubmit={submitMessage} />
                    </div>

                </section>
            </main>
        </>
    );
};

export default Home;