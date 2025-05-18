import type { Model } from "../types/chat.tsx";

export const models: Model[] = [
    { name: "ChatGPT 4o", model: "gpt-4o", description: "models.gpt-4o.description", visionSupport: true },
    { name: "ChatGPT 4o mini", model: "gpt-4o-mini", description: "models.gpt-4o-mini.description", visionSupport: true },
    { name: "OpenAI o1 mini", model: "o1-mini", description: "models.o1-mini.description", visionSupport: true },
    { name: "OpenAI o3 mini", model: "o3-mini", description: "models.o3-mini.description", visionSupport: true },
    { name: "OpenAI o4 mini", model: "o4-mini", description: "models.o4-mini.description", visionSupport: false },
    // { name: "Command R+ (08/2024)", model: "command-r-plus-08-2024", description: "models.command-r-plus-08-2024.description", visionSupport: false },
    { name: "Gemini 2.5 Flash", model: "gemini-2.5-flash", description: "models.gemini-2.5-flash.description", visionSupport: true },
    { name: "Gemini 2.0 Flash Thinking", model: "gemini-2.0-flash-thinking", description: "models.gemini-2.0-flash-thinking.description", visionSupport: true },
    { name: "Qwen 2.5 Coder 32B", model: "qwen-2.5-coder-32b", description: "models.qwen-2.5-coder-32b.description", visionSupport: false },
    { name: "LLaMA 3.3 70B", model: "llama-3.3-70b", description: "models.llama-3.3-70b.description", visionSupport: false },
    { name: "LLaMA 4 Scout", model: "llama-4-scout", description: "models.llama-4-scout.description", visionSupport: false },
    { name: "LLaMA 4 Scout 17B", model: "llama-4-scout-17b", description: "models.llama-4-scout-17b.description", visionSupport: false },
    { name: "Mistral Small 3.1 24B", model: "mistral-small-3.1-24b", description: "models.mistral-small-3.1-24b.description", visionSupport: false },
    { name: "DeepSeek R1", model: "deepseek-r1", description: "models.deepseek-r1.description", visionSupport: false },
    { name: "DeepSeek R1 Distill (LLaMA 70B)", model: "deepseek-r1-distill-llama-70b", description: "models.deepseek-r1-distill-llama-70b.description", visionSupport: false },
    { name: "DeepSeek R1 Distill (Qwen 32B)", model: "deepseek-r1-distill-qwen-32b", description: "models.deepseek-r1-distill-qwen-32b.description", visionSupport: false },
    { name: "Phi-4", model: "phi-4", description: "models.phi-4.description", visionSupport: false },
    { name: "QWQ 32B", model: "qwq-32b", description: "models.qwq-32b.description", visionSupport: false }
    // { name: "DeepSeek V3", model: "deepseek-v3", description: "models.deepseek-v3.description", visionSupport: false }
];
