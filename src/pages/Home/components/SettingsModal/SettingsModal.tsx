import styles from "./SettingsModal.module.scss";
import { useSettings } from "../../../../store/settings.tsx";
import {type RefObject, useRef, useState} from "react";
import {useClickOutside} from "../../../../hooks/useClickOutside.tsx";
import {AnimatePresence, motion} from "motion/react";
import { useTranslation } from "react-i18next";
import {languages} from "../../../../data/languages.tsx";

type SettingsModalProps = {
    openSettingsButtonRef: RefObject<HTMLButtonElement | null>;
};

const SettingsModal = ({openSettingsButtonRef}: SettingsModalProps) => {
    const { t, i18n } = useTranslation();
    const { settingsOpened, setSettingsOpened } = useSettings();
    const settingsRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

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
                    <div className={styles.settingsContent}>
                        <h1>{t('select_language')}</h1>

                        <div className={styles.dropdown}>
                            <button onClick={() => setIsOpen(!isOpen)} className={styles.dropdownButton}>
                                <img alt="language flag" src={languages.find((item) => item.code === i18n.language)?.icon} />
                                {languages.find((item) => item.code === i18n.language)?.name}
                            </button>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.ul
                                        className={styles.dropdownContent}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        {languages.map((item, index) => (
                                            <li onClick={() => {changeLanguage(item.code); setIsOpen(false)}} key={index} className={styles.dropdownItem}>
                                                <div className={styles.dropdownItem__text}>
                                                    <img alt="language flag" src={item.icon}/>
                                                    {item.name}
                                                </div>
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SettingsModal;