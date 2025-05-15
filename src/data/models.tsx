import type { Model } from "../types/chat.tsx";

export const models: Model[] = [
    { name: "ChatGPT 4o", model: "gpt-4o", description: "Understands text and images. Very fast and smart. The best at the moment.", visionSupport: true },
    { name: "ChatGPT 4o mini", model: "gpt-4o-mini", description: "Faster and cheaper version of GPT-4o. Can see images.", visionSupport: true },
    { name: "OpenAI o4 Mini", model: "o4-mini", description: "Compact model from OpenAI. Supports image input.", visionSupport: true },
    { name: "OpenAI o1 Mini", model: "o1-mini", description: "Simple lightweight model. Can handle pictures.", visionSupport: true },
    { name: "OpenAI o3 Mini", model: "o3-mini", description: "Balanced mini model for text. Can see images.", visionSupport: true },
    { name: "Command R+ (08/2024)", model: "command-r-plus-08-2024", description: "Great for document search and answering with context. No image support.", visionSupport: false },
    { name: "Gemini 2.5 Flash", model: "gemini-2.5-flash", description: "Very fast Google model. Text only.", visionSupport: false },
    { name: "Gemini 2.0 Flash Thinking", model: "gemini-2.0-flash-thinking", description: "Best for logic and planning. Doesn't work with images.", visionSupport: false },
    { name: "Qwen 2.5 Coder 32B", model: "qwen-2.5-coder-32b", description: "Powerful coding model from Alibaba. No image support.", visionSupport: false },
    { name: "LLaMA 3.3 70B", model: "llama-3.3-70b", description: "Large model from Meta. Works only with text.", visionSupport: false },
    { name: "LLaMA 4 Scout", model: "llama-4-scout", description: "Early LLaMA 4 test model. Doesn't support images.", visionSupport: false },
    { name: "LLaMA 4 Scout 17B", model: "llama-4-scout-17b", description: "Smaller version of LLaMA 4 Scout. Text only.", visionSupport: false },
    { name: "Mistral Small 3.1 24B", model: "mistral-small-3.1-24b", description: "Fast and general-purpose. No image support.", visionSupport: false },
    { name: "DeepSeek R1", model: "deepseek-r1", description: "Good for code and general text. Can't see pictures.", visionSupport: false },
    { name: "DeepSeek R1 Distill (LLaMA 70B)", model: "deepseek-r1-distill-llama-70b", description: "Simplified DeepSeek version based on LLaMA. No image support.", visionSupport: false },
    { name: "DeepSeek R1 Distill (Qwen 32B)", model: "deepseek-r1-distill-qwen-32b", description: "Another DeepSeek version based on Qwen. No image input.", visionSupport: false },
    { name: "Phi-4", model: "phi-4", description: "Small and accurate model from Microsoft. Text only.", visionSupport: false },
    { name: "QWQ 32B", model: "qwq-32b", description: "High-capacity text model. Doesn't support images.", visionSupport: false },
    { name: "DeepSeek V3", model: "deepseek-v3", description: "Strong in code and logic tasks. No image support.", visionSupport: false }
];