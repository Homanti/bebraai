import {create} from "zustand/index";

type ImageViewContent = string

type imageViewerState = {
    imageViewerOpened: boolean;
    setImageViewer: (value: boolean, content?: ImageViewContent) => void;
    imageViewContent: ImageViewContent | null;
};

export const useImageViewerStore = create<imageViewerState>((set) => ({
    imageViewerOpened: false,
    imageViewContent: null,
    setImageViewer: (value, content) => set({
        imageViewerOpened: value,
        imageViewContent: content || null,
    })
}));