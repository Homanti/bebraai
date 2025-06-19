import { create } from 'zustand';
import { getSettings, saveSettings } from "../utils/settingsStorage";

type SettingsState = {
    settingsOpened: boolean;
    setSettingsOpened: (value: boolean) => void;
};

export interface SettingsStore {
    modelName: {modelName: string, providerName: string};
    setModelName: (modelName: string, providerName: string) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    modelName: getSettings().modelName || { modelName: "ChatGPT 4o", providerName: "PollinationsAI" },
    setModelName: (modelName, providerName) => {
        const updated = { ...getSettings(), modelName: { modelName: modelName, providerName: providerName } };
        saveSettings(updated);
        set({ modelName: updated.modelName });
    }
}));

export const useSettings = create<SettingsState>((set) => ({
    settingsOpened: false,
    setSettingsOpened: (value: boolean) => set({ settingsOpened: value }),
}));
