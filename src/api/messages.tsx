import type { Message } from "../types/chat.tsx";

export const sendMessage = async (
    messages: Message[],
    onChunk: (chunk: string) => void
): Promise<void> => {
    const formData = new FormData();

    formData.append('messages', JSON.stringify(
        messages.map((m) => ({
            role: m.role,
            content: m.content || "",
        }))
    ));

    messages.forEach((msg, msgIndex) => {
        msg.files?.forEach((item, fileIndex) => {
            if (item.data.startsWith("data:")) {
                const [meta, base64] = item.data.split(',');
                const mimeMatch = meta.match(/data:(.*?);base64/);
                if (!mimeMatch) return;

                const mime = mimeMatch[1];
                const binary = atob(base64);
                const len = binary.length;
                const buffer = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    buffer[i] = binary.charCodeAt(i);
                }
                const blob = new Blob([buffer], { type: mime });
                const ext = mime.split('/')[1];
                const filename = `file-${msgIndex}-${fileIndex}.${ext}`;
                formData.append('files', blob, filename);
            }
        });
    });

    const response = await fetch('https://bebraai-fastapi-production.up.railway.app/api/messages', {
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