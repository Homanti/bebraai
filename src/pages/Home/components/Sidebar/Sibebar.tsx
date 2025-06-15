import styles from "./Sibebar.module.scss";
import {AnimatePresence, motion} from "motion/react";
import SvgButton from "../../../../components/SvgButton/SvgButton.tsx";
import {Menu, Trash, SquarePen} from "lucide-react";
import type {Chat} from "../../../../types/chat.tsx";
import {useEffect, useRef, useState} from "react";
import { useSidebar } from "../../../../store/sidebar.tsx";
import {useClickOutside} from "../../../../hooks/useClickOutside.tsx";
import {useTranslation} from "react-i18next";

type SidebarProps = {
    chats: Chat[];
    updateChats: (chats: Chat[]) => void;
    setActiveChatId: (id: string) => void;
    activeChatId: string;
}

const Sidebar = ({ chats, updateChats, setActiveChatId, activeChatId }: SidebarProps) => {
    const { t } = useTranslation();
    const [width, setWidth] = useState(window.innerWidth);
    const { sidebarOpened, setSidebarOpened, xOffset } = useSidebar();
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isSidebarOpening, setIsSidebarOpening] = useState(false);
    const isMobile = width <= 768;

    useClickOutside(sidebarRef, () => setSidebarOpened(false), (width / 16) < 48);

    const createNewChat = () => {
        setIsSidebarOpening(false);
        const nextId = (Math.max(...chats.map(c => Number(c.id)), 0) + 1).toString();
        const newChat: Chat = {
            id: nextId,
            title: 'new_chat',
            messages: [],
        };
        const newChats = [...chats, newChat];
        updateChats(newChats);
        setActiveChatId(newChat.id);
    };

    const deleteChat = (id: string) => {
        if (chats.length === 1) {
            setIsSidebarOpening(false);

            const defaultChat: Chat = { id: '1', title: 'new_chat', messages: [] };
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

    const motionProps = isMobile
        ? {
            initial: { x: "-18.125rem" },
            animate: { x: xOffset != false ? `${xOffset}rem` : 0 },
            exit: { x: "-18.125rem" },
            transition: { type: "spring", stiffness: 500, damping: 40 },
        }
        : {
            initial: { width: "0rem" },
            animate: { width: "18.125rem" },
            exit: { width: "0rem" }
        };

    const liMotionProps =
        !isSidebarOpening ? {
            initial: { opacity: 0, x: -300 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -300 },
    } : {
            initial: undefined,
            animate: undefined,
            exit: undefined,
        };

    useEffect(() => {
        setSidebarOpened(window.innerWidth > 768);
    }, [setSidebarOpened]);

    useEffect(() => {
        setIsSidebarOpening(true);
    }, [sidebarOpened]);

    return (
        <>
            <AnimatePresence>
                {(sidebarOpened) && (
                    <motion.nav
                        className={styles.sidebar}
                        {...motionProps}
                        ref={sidebarRef}
                    >
                        <div className={styles.inner} aria-hidden={!sidebarOpened ? "true" : "false"} id={"sidebar-content"}>
                            <div className={styles.buttonsContainer}>
                                <SvgButton onClick={() => setSidebarOpened(!sidebarOpened)} aria-expanded={sidebarOpened} aria-label={t("aria.button_open_sidebar")} title={t("aria.button_open_sidebar")} aria-controls={"sidebar-content"}>
                                    <Menu />
                                </SvgButton>
                                <SvgButton onClick={createNewChat} aria-label={t("aria.button_create_new_chat")} title={t("aria.button_create_new_chat")}>
                                    <SquarePen />
                                </SvgButton>
                            </div>
                            <ul>
                                <AnimatePresence mode="popLayout">
                                    {[...chats].reverse().map(chat => (
                                        <motion.li
                                            key={chat.id}
                                            className={`${chat.id === activeChatId ? styles.active : ''} ${isSidebarOpening ? styles.disableLiMovement : ''}`} // не бейте за это, я инвалид
                                            onClick={() => setActiveChatId(chat.id)}
                                            {...liMotionProps}
                                            layout
                                            transition= {{
                                                layout: { type: "spring", stiffness: 500, damping: 40 },
                                                x: { type: "spring", stiffness: 500, damping: 30 },
                                                opacity: { duration: 0.2 }
                                            }}
                                        >
                                            <span>{t(chat.title)}</span>
                                            <SvgButton className={styles.trashButton} onClick={() => deleteChat(chat.id)} aria-label={t("aria.button_delete_chat")} title={t("aria.button_delete_chat")}>
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