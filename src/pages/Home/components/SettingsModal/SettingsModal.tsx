import styles from "./SettingsModal.module.scss";
import { useSettings } from "../../../../store/settings.tsx";
import {type RefObject, useRef} from "react";
import {useClickOutside} from "../../../../hooks/useClickOutside.tsx";
import {AnimatePresence, motion} from "motion/react";

type SettingsModalProps = {
    openSettingsButtonRef: RefObject<HTMLButtonElement | null>;
};

const SettingsModal = ({openSettingsButtonRef}: SettingsModalProps) => {
    const { settingsOpened, setSettingsOpened } = useSettings();
    const settingsRef = useRef<HTMLDivElement>(null);

    useClickOutside(settingsRef, () => setSettingsOpened(false), true, openSettingsButtonRef)

    return (
        <AnimatePresence>
            {settingsOpened && (
                <motion.div
                    className={styles.settings}
                    ref={settingsRef}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    <h1>Bebra</h1>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SettingsModal;