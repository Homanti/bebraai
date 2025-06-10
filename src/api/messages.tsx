import type { Message } from "../types/chat.tsx";
import { models } from "../data/models.tsx";

const url = "https://bebraai-fastapi-production.up.railway.app"

export const sendMessage = async (
    messages: Message[],
    modelName: string = "ChatGPT 4o",
    draw: boolean = false,
    web_search: boolean = false,
    onChunk: (chunk: string) => void,
): Promise<void> => {
    const formData = new FormData();

    formData.append('messages', JSON.stringify(
        messages.map((m) => ({
            role: m.role,
            content: m.content || "",
        }))
    ));

    const model = models.find((m) => m.name === modelName)?.model || "gpt-4o";

    formData.append('model', model);

    const mods = {
        draw: draw,
        web_search: web_search,
    };

    formData.append('mods', JSON.stringify(mods));

    const files = messages.flatMap((m) => m.files || []).map((f) => f.file_url);
    for (const url of files) {
        formData.append('files_url', url);
    }

    const response = await fetch(url + '/api/stream/generate', {
        method: 'POST',
        body: formData
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

export const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(url + '/files/upload/', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to upload file');
    }

    const data = await response.json();

    if (!data || !data.url) {
        throw new Error(response.status + response.statusText || 'Invalid response from server');
    }

    return data.url;
}