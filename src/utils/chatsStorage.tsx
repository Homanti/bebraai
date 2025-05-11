import type {Chat} from "../types/chat.tsx";

export const saveChats = (chats: Chat[]) => {
    localStorage.setItem('chats', JSON.stringify(chats));
};

export const getChats = (): Chat[] => {
    const raw = localStorage.getItem('chats');
    try {
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.warn('localStorage error:', error);
        return [];
    }
};