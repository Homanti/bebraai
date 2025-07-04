import {AnimatePresence, motion} from "motion/react";
import styles from "./ImageViewer.module.scss";
import {useClickOutside} from "../../../../hooks/useClickOutside.tsx";
import {useImageViewerStore} from "../../../../store/imageviewer.tsx";
import {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import ImageWithLoader from "../../../../components/ImageWithLoader/ImageWithLoader.tsx";

const ImageViewer = () => {
    const { imageViewerOpened, imageViewContent, setImageViewer } = useImageViewerStore();
    const imageViewerRef = useRef(null);
    const { t } = useTranslation();

    useClickOutside(imageViewerRef, () => {
        setImageViewer(false);
    }, true)

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setImageViewer(false);
            }
        }

        if (imageViewerOpened) {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [imageViewerOpened, setImageViewer]);

    return (
        <AnimatePresence>
            { imageViewerOpened && (
                <motion.div
                    className={styles.backdrop}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className={styles.imageViewer}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        ref={imageViewerRef}
                    >
                        {imageViewContent ? (
                            <ImageWithLoader src={imageViewContent} alt="Large view" className={styles.imageViewer__img}/>
                        ):(
                            <div className={styles.error}>
                                <h2>{t('error.display_image_error')}</h2>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ImageViewer;