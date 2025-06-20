import type { Message } from "../types/chat.tsx";
import { models } from "../data/models.tsx";

const url = "https://bebraai-fastapi-production.up.railway.app"
// const url = "http://127.0.0.1:8000"

export const generateText = async (
    messages: Message[],
    modelName: { modelName: string; providerName: string },
    web_search: boolean = false,
    onChunk: (chunk: string) => void,
): Promise<void | string> => {

    const formData = new FormData();

    formData.append('messages', JSON.stringify(
        messages.map((m) => ({
            role: m.role,
            content: m.content || "",
        }))
    ));

    const model = models.find((m) => m.name === modelName.modelName && m.provider === modelName.providerName)?.model || "gpt-4o";
    formData.append('model', model);

    formData.append('provider', modelName.providerName);

    formData.append('web_search', web_search ? 'true' : 'false');

    const files = messages.flatMap((m) => m.files || []).map((f) => f.file_url);
    for (const fileUrl of files) {
        if (!fileUrl) continue;
        formData.append('files_url', fileUrl);
    }

    const response = await fetch(url + '/api/stream/generate', {
        method: 'POST',
        body: formData,
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

export const generateImage = async (prompt: string) => {
    const formData = new FormData();
    formData.append('prompt', prompt);

    const response = await fetch(url + '/api/image/generate', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) throw new Error('Failed to generate image');

    const data = await response.json();

    return data.content;
};

const compressImage = (file: File, quality = 0.7): Promise<File> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1024;
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;

            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('Canvas context error'));

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                if (!blob) return reject(new Error('Compression failed'));
                const compressedFile = new File([blob], file.name, { type: file.type });
                resolve(compressedFile);
            }, file.type, quality);
        };

        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
};

export const transcriptAudio = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('audio', file);

    const response = await fetch(url + '/api/audio/transcript', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to upload audio file');
    }

    const data = await response.json();

    if (!data || !data.text) {
        throw new Error(response.status + response.statusText || 'Invalid response from server');
    }

    return data.text;
}

export const uploadFile = async (file: File): Promise<string> => {
    const compressedFile = file.type.startsWith('image/')
        ? await compressImage(file, 0.7)
        : file;

    const formData = new FormData();
    formData.append('file', compressedFile);

    const response = await fetch(url + '/files/upload', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to upload file');
    }

    const data = await response.json();

    if (!data || !data.image_url) {
        throw new Error(response.status + response.statusText || 'Invalid response from server');
    }

    return data.image_url;
};