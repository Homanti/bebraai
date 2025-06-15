import { create } from 'zustand';

type SidebarState = {
    isSidebarOpened: boolean;
    setIsSidebarOpened: (value: boolean) => void;
    xOffset: number | boolean,
    setXOffset: (value: number | boolean) => void;
    isSwipingAllowed: boolean;
    setIsSwipingAllowed: (value: boolean) => void;
    // velocity: number;
    // setVelocity: (value: number) => void;
};

export const useSidebar = create<SidebarState>((set) => ({
    isSidebarOpened: false,
    setIsSidebarOpened: (value) => set({ isSidebarOpened: value }),
    xOffset: false,
    setXOffset: (value) => set({ xOffset: value }),
    isSwipingAllowed: true,
    setIsSwipingAllowed: (value) => set({ isSwipingAllowed: value }),
    // velocity: 2.5,
    // setVelocity: (value) => set({velocity: value}),
}));
