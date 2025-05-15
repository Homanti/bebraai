import { create } from 'zustand';
import { getSettings, saveSettings } from "../utils/settingsStorage";

export interface SettingsState {
    modelName: string;
    setModelName: (name: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    modelName: getSettings().modelName,

    setModelName: (name: string) => {
        const updated = { ...getSettings(), modelName: name };
        saveSettings(updated);
        set({ modelName: name });
    }
}));
