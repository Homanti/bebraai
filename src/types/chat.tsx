export type Message = {
    content?: string;
    files?: { id: string; data: string }[];
    role: 'user' | 'assistant';
}

export type Chat = {
    id: string;
    title: string;
    messages: Message[];
};

export type Model = {
    name: string;
    model: string;
};