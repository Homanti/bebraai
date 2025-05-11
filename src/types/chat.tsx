export type Message = {
    content: string;
    role: 'user' | 'assistant';
}

export type Chat = {
    id: string;
    title: string;
    messages: Message[];
};