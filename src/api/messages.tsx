import type {Message} from "../types/chat.tsx";

export const sendMessage = async (
    messages: Message[],
    onChunk: (chunk: string) => void
): Promise<void> => {
    const response = await fetch('http://192.168.0.194:8000/api/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages), // ⬅️ отправляем просто массив сообщений
    });

    if (!response.ok || !response.body) {
        throw new Error('Failed to send message');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            if (line.trim()) {
                try {
                    const json = JSON.parse(line);
                    onChunk(json.content);
                } catch (err) {
                    console.error('JSON parsing error: ', err, line);
                }
            }
        }
    }
};
