import { create } from 'zustand';

type SidebarState = {
    sidebarOpened: boolean;
    setSidebarOpened: (value: boolean) => void;
    xOffset: unknown,
    setXOffset: (value: unknown) => void;
};

export const useSidebar = create<SidebarState>((set) => ({
    sidebarOpened: false,
    setSidebarOpened: (value) => set({ sidebarOpened: value }),
    xOffset: false,
    setXOffset: (value) => set({ xOffset: value })
}));
