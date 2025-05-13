import styles from './Home.module.scss';
import PromptForm from './components/PromptForm/PromptForm.tsx';
import { useState } from "react";
import { sendMessage } from "../../api/messages.tsx";
import type { Message, Chat } from "../../types/chat.tsx";
import { getChats, saveChats } from "../../utils/chatsStorage.tsx";
import 'katex/dist/katex.min.css';
import Sidebar from "./components/Sidebar/Sibebar.tsx";
import Messages from "./components/Messages/Messages.tsx";
import { scrollToBottom } from "../../utils/scrollToBottom.tsx";
import Header from "./components/Header/Header.tsx";
import {AnimatePresence, motion} from "motion/react";
import {getSettings} from "../../utils/settingsStorage.tsx";

const Home = () => {
    const [chats, setChats] = useState<Chat[]>(getChats());
    const [activeChatId, setActiveChatId] = useState(() => {
        const existing = getChats();
        if (existing.length > 0) return existing[existing.length - 1].id;
        const defaultChat: Chat = { id: '1', title: 'New chat', messages: [] };
        saveChats([defaultChat]);
        return '1';
    });

    const activeChat = chats.find(c => c.id === activeChatId)!;

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
                    title: chat.title === 'New chat' && newMessages.length > 0 && newMessages[0].content
                        ? newMessages[0].content.slice(0, 50)
                        : chat.title
                }
                : chat
        );
        updateChats(updatedChats);
    };

    const submitMessage = async (message: Message) => {
        const userMessage: Message = { content: message.content, files: message.files, role: 'user' };
        const updatedUserMessages = [...activeChat.messages, userMessage];

        updateActiveChatMessages(updatedUserMessages);
        scrollToBottom();

        let assistantText = '';
        let currentMessages = [...updatedUserMessages];
        let assistantAdded = false;

        const modelName = getSettings().modelName || 'ChatGPT 4o';

        await sendMessage(currentMessages, modelName, (chunk: string) => {
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

    return (
        <>
            <main>
                <Sidebar chats={chats} updateChats={updateChats} setActiveChatId={setActiveChatId} activeChatId={activeChatId} />

                <motion.section
                    className={styles.chat}
                    layout
                >
                    <Header />

                    <div className={styles.chatContent}>
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

                        <Messages activeChat={activeChat} />

                        <div className={`${styles.prompt} ${styles.gradientBorder}`}>
                            <PromptForm onSubmit={submitMessage} />
                        </div>
                    </div>
                </motion.section>
            </main>
        </>
    );
};

export default Home;