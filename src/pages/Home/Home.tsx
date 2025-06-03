import styles from './Home.module.scss';
import PromptForm from './components/PromptForm/PromptForm.tsx';
import {useRef, useState} from "react";
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
import SettingsModal from "./components/SettingsModal/SettingsModal.tsx";
import {useTranslation} from "react-i18next";
import ImageViewer from "./components/ImageViewer/ImageViewer.tsx";

const Home = () => {
    const { t } = useTranslation();
    const [chats, setChats] = useState<Chat[]>(getChats());
    const [activeChatId, setActiveChatId] = useState(() => {
        const existing = getChats();
        if (existing.length > 0) return existing[existing.length - 1].id;
        const defaultChat: Chat = { id: '1', title: t('new_chat'), messages: [] };
        saveChats([defaultChat]);
        return '1';
    });
    const openSettingsButtonRef = useRef<HTMLButtonElement>(null);

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
                    title: chat.title === t('new_chat') && newMessages.length > 0 && newMessages[0].content
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

        const currentMessagesWithoutFilesExceptLast: Message[] = currentMessages.map((msg, index, arr) => ({
            ...msg,
            files: index === arr.length - 1 ? msg.files : [],
        }));

        let assistantAdded = false;

        const modelName = getSettings().modelName || 'ChatGPT 4o';

        await sendMessage(currentMessagesWithoutFilesExceptLast, modelName, message.draw, message.web_search, (chunk: string) => {
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
        <motion.div className={styles.home}>
            <SettingsModal openSettingsButtonRef={openSettingsButtonRef} />
            <Sidebar chats={chats} updateChats={updateChats} setActiveChatId={setActiveChatId} activeChatId={activeChatId} />

            <main>
                <Header openSettingsButtonRef={openSettingsButtonRef} />

                <AnimatePresence>
                    {activeChat.messages.length === 0 && (
                        <motion.h1
                            className={styles.title}
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                        >
                            {t('welcome_message')}
                        </motion.h1>
                    )}
                </AnimatePresence>

                <section className={styles.chat}>
                    <Messages activeChat={activeChat} />

                    <motion.div className={`${styles.prompt}`}>
                        <PromptForm onSubmit={submitMessage} />
                    </motion.div>
                </section>
            </main>

            <ImageViewer />
        </motion.div>
    );
};

export default Home;