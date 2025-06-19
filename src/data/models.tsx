import type { Model } from "../types/chat.tsx";

export const models: Model[] = [
    { name: "ChatGPT-4o", model: "gpt-4o", developer: "OpenAI", visionSupport: true, provider: "PollinationsAI" },
    { name: "ChatGPT-4.1", model: "gpt-4.1", developer: "OpenAI", visionSupport: true, provider: "PollinationsAI" },
    { name: "ChatGPT-4.1 Mini", model: "gpt-4.1-mini", developer: "OpenAI", visionSupport: true, provider: "PollinationsAI" },
    { name: "ChatGPT-4.1 Nano", model: "gpt-4.1-nano", developer: "OpenAI", visionSupport: true, provider: "PollinationsAI" },
    { name: "ChatGPT o3", model: "o3", developer: "OpenAI", visionSupport: true, provider: "PollinationsAI" },
    { name: "Mistral Small 3.1 24B", model: "mistral-small-3.1-24b-instruct", developer: "Mistral", visionSupport: true, provider: "PollinationsAI" },
    { name: "Phi-4 Mini Instruct", model: "phi-4-mini-instruct", developer: "Microsoft", visionSupport: true, provider: "PollinationsAI" },
    { name: "BIDARA", model: "bidara", developer: "NASA", visionSupport: true, provider: "PollinationsAI" },
    { name: "Mirexa AI Companion", model: "mirexa", developer: "Mirexa", visionSupport: true, provider: "PollinationsAI" },
    { name: "Sur AI Assistant", model: "sur", developer: "Sur", visionSupport: true, provider: "PollinationsAI" },
    { name: "DeepSeek V3", model: "deepseek-v3", developer: "DeepSeek", visionSupport: false, provider: "PollinationsAI" },
    { name: "DeepSeek R1 0528", model: "deepseek-r1-0528", developer: "DeepSeek", visionSupport: false, provider: "PollinationsAI" },
    { name: "Grok-3 Mini", model: "grok-3-mini", developer: "xAI", visionSupport: false, provider: "PollinationsAI" },
    { name: "Llama 4 Scout 17B", model: "llama-4-scout-17b-16e-instruct", developer: "Meta", visionSupport: false, provider: "PollinationsAI" },
    { name: "Qwen 2.5 Coder 32B", model: "qwen2.5-coder-32b-instruct", developer: "Alibaba", visionSupport: false, provider: "PollinationsAI" },
    { name: "Elixpo Search", model: "elixposearch", developer: "Elixpo", visionSupport: false, provider: "PollinationsAI" },
    { name: "Midjourney", model: "midijourney", developer: "Midjourney, Inc.", visionSupport: false, provider: "PollinationsAI" }
];