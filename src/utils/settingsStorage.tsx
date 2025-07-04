import type { Settings } from "../types/settings.tsx";

export const saveSettings = (settings: Settings) => {
    localStorage.setItem("settings", JSON.stringify(settings));
};

export const getSettings = (): Settings => {
    const raw = localStorage.getItem("settings");
    try {
        return raw ? JSON.parse(raw) : { modelName: { modelName: "ChatGPT 4o", providerName: "PollinationsAI" }};
    } catch (error) {
        console.warn("localStorage error:", error);
        return { modelName: { modelName: "ChatGPT 4o", providerName: "PollinationsAI" } };
    }
};