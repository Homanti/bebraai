import styles from './Home.module.scss';
import PromptForm from './components/PromptForm/PromptForm.tsx';
import {useRef, useState} from "react";
import {generateImage, generateText} from "../../api/messages.tsx";
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
import {useSwipeable} from "react-swipeable";
import {useSidebar} from "../../store/sidebar.tsx";

const Home = () => {
    const { t } = useTranslation();
    const [chats, setChats] = useState<Chat[]>(getChats());
    const [activeChatId, setActiveChatId] = useState(() => {
        const existing = getChats();
        if (existing.length > 0) return existing[existing.length - 1].id;
        const defaultChat: Chat = { id: '1', title: 'new_chat', messages: [] };
        saveChats([defaultChat]);
        return '1';
    });
    const openSettingsButtonRef = useRef<HTMLButtonElement>(null);
    const { setIsSidebarOpened, setXOffset, isSwipingAllowed } = useSidebar();

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
                    title: chat.title === 'new_chat' && newMessages.length > 0 && newMessages[0].content
                        ? newMessages[0].content.slice(0, 50)
                        : chat.title
                }
                : chat
        );
        updateChats(updatedChats);
    };

    const submitMessage = async (message: Message, setFormDisabled: (disabled: boolean) => void) => {
        const userMessage: Message = { content: message.content, files: message.files, role: 'user' };
        const updatedUserMessages = [...activeChat.messages, userMessage];
        setFormDisabled(true);

        updateActiveChatMessages(updatedUserMessages);
        scrollToBottom();

        let assistantText = '';
        let currentMessages = [...updatedUserMessages];

        const currentMessagesWithoutFilesExceptLast: Message[] = currentMessages.map((msg, index, arr) => ({
            ...msg,
            files: index === arr.length - 1 ? msg.files : [],
        }));

        let assistantAdded = false;

        const modelName: { "modelName": string, "providerName": string } = getSettings().modelName || { modelName: 'ChatGPT 4o', providerName: 'PollinationsAI' };

        try {
            if (!message.draw) {
                await generateText(currentMessagesWithoutFilesExceptLast, modelName, message.web_search, (chunk: string) => {
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
            } else {
                const prompt = currentMessages[currentMessages.length - 1].content;

                if (prompt) {
                    const imageUrl: string = await generateImage(prompt);

                    const updatedMessages = [...currentMessages];
                    updatedMessages.push({
                        content: '',
                        files: [{ id: crypto.randomUUID(), file_url: imageUrl }],
                        role: 'assistant',
                    });
                    updateActiveChatMessages(updatedMessages);
                    currentMessages = updatedMessages;
                }
            }
        } finally {
            setFormDisabled(false);
        }
    };

    const minX = -(18.125 * 16);

    const handlers = useSwipeable({
        onSwipeStart: isSwipingAllowed ? (eventData) => {
            const deltaX = eventData.deltaX;
            const deltaY = eventData.deltaY;

            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);

            if (absY > absX) return;
            if (deltaX < minX) return;

            setIsSidebarOpened(true);
        } : undefined,
        onSwiping: isSwipingAllowed ? (eventData) => {
            const deltaX = eventData.deltaX;
            const deltaY = eventData.deltaY;

            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);

            const newX = Math.min(0, minX + deltaX);

            if (absY > absX) return;
            if (deltaX < minX) return;

            setXOffset(newX / 16);
        } : undefined,
        onSwipedRight: isSwipingAllowed ? (eventData) => {
            const deltaX = eventData.deltaX;
            const deltaY = eventData.deltaY;

            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);

            const newX = Math.min(0, minX + deltaX);
            const velocity = eventData.velocity;

            if (absY > absX) return;
            if (deltaX < minX) return;

            if (newX > -110 || velocity > 0.3) {
                setXOffset(0);
                setIsSidebarOpened(true);
            } else {
                setXOffset(false);
                setTimeout(() => {
                    setIsSidebarOpened(false); // костыль не бейте
                }, 1);}
        } : undefined,
        onSwipedLeft: isSwipingAllowed ? () => {
            setXOffset(false);
            setIsSidebarOpened(false);
        } : undefined,
        trackMouse: false,
    });

    return (
        <motion.div className={styles.home}>
            <SettingsModal openSettingsButtonRef={openSettingsButtonRef} />
            <ImageViewer />
            <Sidebar chats={chats} updateChats={updateChats} setActiveChatId={setActiveChatId} activeChatId={activeChatId} />

            <main {...(isSwipingAllowed ? handlers : {})}>
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

        </motion.div>
    );
};

export default Home;