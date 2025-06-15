import { create } from 'zustand';

type SidebarState = {
    sidebarOpened: boolean;
    setSidebarOpened: (value: boolean) => void;
    xOffset: number | boolean,
    setXOffset: (value: number | boolean) => void;
    // velocity: number;
    // setVelocity: (value: number) => void;
};

export const useSidebar = create<SidebarState>((set) => ({
    sidebarOpened: false,
    setSidebarOpened: (value) => set({ sidebarOpened: value }),
    xOffset: false,
    setXOffset: (value) => set({ xOffset: value }),
    // velocity: 2.5,
    // setVelocity: (value) => set({velocity: value}),
}));
