import { create } from 'zustand';

type Message = {
    content: string;
    files: { id: string; data: string }[];
    role: 'user' | 'assistant';
    draw?: boolean;
    web_search?: boolean;
};

type MessageState = {
    message: Message;
    setMessage: (msg: Partial<Message>) => void;
    resetMessage: () => void;
};

export const useMessageStore = create<MessageState>((set, get) => ({
    message: {
        content: '',
        files: [],
        role: 'user',
        draw: false,
        web_search: false,
    },
    setMessage: (msg) =>
        set((state) => ({
            message: { ...state.message, ...msg },
        })),
    resetMessage: () => {
        const { draw, web_search } = get().message;
        set({
            message: {
                content: '',
                files: [],
                role: 'user',
                draw,
                web_search,
            },
        });
    },
}));