import type { Model } from "../types/chat.tsx";

export const models: Model[] = [
    { name: "ChatGPT 4o", model: "gpt-4o", description: "Very fast and smart. The best at the moment.", visionSupport: true },
    { name: "ChatGPT 4o mini", model: "gpt-4o-mini", description: "Faster and cheaper version of GPT-4o.", visionSupport: true },
    { name: "OpenAI o1 mini", model: "o1-mini", description: "Smarter than 4o, but slower. Simple lightweight model.", visionSupport: true },
    { name: "OpenAI o3 mini", model: "o3-mini", description: "Smarter than o1, but slower. Balanced mini model for text.", visionSupport: true },
    { name: "OpenAI o4 mini", model: "o4-mini", description: "Smarter than o3 but slower. Compact model from OpenAI.", visionSupport: false },
    // { name: "Command R+ (08/2024)", model: "command-r-plus-08-2024", description: "Great for document search and answering with context.", visionSupport: false },
    { name: "Gemini 2.5 Flash", model: "gemini-2.5-flash", description: "Very fast Google model.", visionSupport: true },
    { name: "Gemini 2.0 Flash Thinking", model: "gemini-2.0-flash-thinking", description: "Best for logic and planning.", visionSupport: true },
    { name: "Qwen 2.5 Coder 32B", model: "qwen-2.5-coder-32b", description: "Powerful coding model from Alibaba.", visionSupport: false },
    { name: "LLaMA 3.3 70B", model: "llama-3.3-70b", description: "Large model from Meta.", visionSupport: false },
    { name: "LLaMA 4 Scout", model: "llama-4-scout", description: "Early LLaMA 4 test model.", visionSupport: false },
    { name: "LLaMA 4 Scout 17B", model: "llama-4-scout-17b", description: "Smaller version of LLaMA 4 Scout.", visionSupport: false },
    { name: "Mistral Small 3.1 24B", model: "mistral-small-3.1-24b", description: "Fast and general-purpose.", visionSupport: false },
    { name: "DeepSeek R1", model: "deepseek-r1", description: "Good for code and general text.", visionSupport: false },
    { name: "DeepSeek R1 Distill (LLaMA 70B)", model: "deepseek-r1-distill-llama-70b", description: "Simplified DeepSeek version based on LLaMA.", visionSupport: false },
    { name: "DeepSeek R1 Distill (Qwen 32B)", model: "deepseek-r1-distill-qwen-32b", description: "Another DeepSeek version based on Qwen.", visionSupport: false },
    { name: "Phi-4", model: "phi-4", description: "Small and accurate model from Microsoft.", visionSupport: false },
    { name: "QWQ 32B", model: "qwq-32b", description: "High-capacity text model.", visionSupport: false },
    // { name: "DeepSeek V3", model: "deepseek-v3", description: "Strong in code and logic tasks.", visionSupport: false }
];