import { create } from 'zustand';
import { getSettings, saveSettings } from "../utils/settingsStorage";

type SettingsState = {
    settingsOpened: boolean;
    setSettingsOpened: (value: boolean) => void;
};

export interface SettingsStore {
    modelName: string;
    setModelName: (name: string) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    modelName: getSettings().modelName,
    setModelName: (name: string) => {
        const updated = { ...getSettings(), modelName: name };
        saveSettings(updated);
        set({ modelName: name });
    }
}));

export const useSettings = create<SettingsState>((set) => ({
    settingsOpened: false,
    setSettingsOpened: (value: boolean) => set({ settingsOpened: value }),
}));
