import styles from "./Sibebar.module.scss";
import {AnimatePresence, motion} from "motion/react";
import SvgButton from "../../../../components/SvgButton/SvgButton.tsx";
import {Menu, Trash, SquarePen} from "lucide-react";
import type {Chat} from "../../../../types/chat.tsx";
import {useEffect, useRef, useState} from "react";
import { useSidebar } from "../../../../store/sidebar.tsx";
import {useClickOutside} from "../../../../hooks/useClickOutside.tsx";

type SidebarProps = {
    chats: Chat[];
    updateChats: (chats: Chat[]) => void;
    setActiveChatId: (id: string) => void;
    activeChatId: string;
}

const Sidebar = ({ chats, updateChats, setActiveChatId, activeChatId }: SidebarProps) => {
    const [width, setWidth] = useState(window.innerWidth);
    const { sidebarOpened, setSidebarOpened } = useSidebar();
    const sidebarRef = useRef<HTMLDivElement>(null);

    useClickOutside(sidebarRef, () => setSidebarOpened(false), (width / 16) < 48);

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
            setActiveChatId(remainingChats.length > 0 ? remainingChats[remainingChats.length -1].id : '');
        }
    };

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const motionProps = width <= 768
        ? {
            initial: { opacity: 0, x: -200 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -200 },
            transition: { type: "spring", stiffness: 500, damping: 40 },
        }
        : {
            initial: { width: "0rem" },
            animate: { width: "18.125rem" },
            exit: { width: "0rem" }
    };

    useEffect(() => {
        setSidebarOpened(window.innerWidth > 768);
    }, [setSidebarOpened]);

    return (
        <>
            <AnimatePresence>
                {(sidebarOpened) && (
                    <motion.nav
                        className={styles.sidebar}
                        {...motionProps}
                        ref={sidebarRef}
                    >
                        <div className={styles.inner}>
                            <div className={styles.buttonsContainer}>
                                <SvgButton onClick={() => setSidebarOpened(!sidebarOpened)}>
                                    <Menu />
                                </SvgButton>
                                <SvgButton onClick={createNewChat}>
                                    <SquarePen />
                                </SvgButton>
                            </div>
                            <ul>
                                <AnimatePresence mode="popLayout">
                                    {[...chats].reverse().map(chat => (
                                        <motion.li
                                            key={chat.id}
                                            className={chat.id === activeChatId ? styles.active : ''}
                                            onClick={() => setActiveChatId(chat.id)}
                                            initial={{ opacity: 0, x: -300 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -300 }}
                                            layout
                                            transition={{
                                                layout: { type: "spring", stiffness: 500, damping: 40 },
                                                x: { type: "spring", stiffness: 500, damping: 30 },
                                                opacity: { duration: 0.2 }
                                            }}
                                        >
                                            <span>{chat.title || 'New chat'}</span>
                                            <SvgButton className={styles.trashButton} onClick={() => deleteChat(chat.id)}>
                                                <Trash />
                                            </SvgButton>
                                        </motion.li>
                                    ))}
                                </AnimatePresence>
                            </ul>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </>
    );
}

export default Sidebar;