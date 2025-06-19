export type MessageFile = {
    id: string;
    file_url?: string;
    file_name?: string;
    file_content?: string;
}

export type Message = {
    content?: string;
    files?: MessageFile[];
    role: 'user' | 'assistant';
    draw?: boolean;
    web_search?: boolean;
}

export type Chat = {
    id: string;
    title: string;
    messages: Message[];
};

export type Model = {
    name: string;
    model: string;
    developer: string;
    visionSupport: boolean;
    provider: string;
};