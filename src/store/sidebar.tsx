import { create } from 'zustand';

type SidebarState = {
    sidebarOpened: boolean;
    setSidebarOpened: (value: boolean) => void;
};

export const useSidebar = create<SidebarState>((set) => ({
    sidebarOpened: false,
    setSidebarOpened: (value) => set({ sidebarOpened: value }),
}));
