import styles from "./SettingsModal.module.scss";
import { useSettings } from "../../../../store/settings.tsx";
import {type RefObject, useEffect, useRef, useState} from "react";
import {useClickOutside} from "../../../../hooks/useClickOutside.tsx";
import {AnimatePresence, motion} from "motion/react";
import { useTranslation } from "react-i18next";
import {languages} from "../../../../data/languages.tsx";
import flagUS from '../../../../assets/flags/flag_us.png';
import Dropdown from "../../../../components/Dropdown/Dropdown.tsx";
import {Moon, Sun, SunMoon} from "lucide-react";
import FocusTrap from "focus-trap-react";

type SettingsModalProps = {
    openSettingsButtonRef: RefObject<HTMLButtonElement | null>;
};

const themes = [
    { name: "Light", code: "light", icon: <Sun /> },
    { name: "Dark", code: "dark", icon: <Moon /> },
    { name: "System", code: "system", icon: <SunMoon /> },
];

const SettingsModal = ({openSettingsButtonRef}: SettingsModalProps) => {
    const { t, i18n } = useTranslation();
    const { settingsOpened, setSettingsOpened } = useSettings();
    const settingsRef = useRef<HTMLDivElement>(null);
    const [langDropdownIsOpen, setLangDropdownIsOpen] = useState(false);
    const [themeDropdownIsOpen, setThemeDropdownIsOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    useClickOutside(settingsRef, () => {
        setSettingsOpened(false);
        setLangDropdownIsOpen(false);
        setThemeDropdownIsOpen(false);
    }, true, openSettingsButtonRef)

    function applyTheme(theme: string) {
        if (theme === 'light' || theme === 'dark') {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        } else if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const systemTheme = prefersDark ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', systemTheme);
            localStorage.setItem('theme', 'system');
        }
    }

    useEffect(() => {
        if (theme === 'system') {
            const media = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = (e: MediaQueryListEvent) => {
                const systemTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', systemTheme);
            };
            media.addEventListener('change', handler);
            return () => media.removeEventListener('change', handler);
        }
    }, [theme]);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setSettingsOpened(false);
            }
        }

        if (settingsOpened) {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [settingsOpened, setSettingsOpened]);

    return (
        <AnimatePresence>
            {settingsOpened && (
                <motion.div className={styles.backdrop}
                            id={"settings-content"}
                            role={"dialog"}
                            aria-hidden={!settingsOpened}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                >
                    <FocusTrap>
                        <motion.div
                            className={styles.settings}
                            ref={settingsRef}
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                        >
                            <h2>{t('settings.settings_label')}</h2>

                            <div className={styles.settingsContent}>

                                <Dropdown isOpen={langDropdownIsOpen} setIsOpen={setLangDropdownIsOpen} customButtonClass={styles.dropdownButton} buttonContent={(() => {
                                    const item = languages.find((item) => item.code === i18n.language);
                                    if (!item) {
                                        changeLanguage("en");

                                        return (
                                            <>
                                                <img alt="English" src={flagUS} />
                                                English
                                            </>
                                        )
                                    }
                                    return (
                                        <>
                                            <img alt={item.name} src={item.icon} />
                                            {item.name}
                                        </>
                                    );
                                })()}>

                                    {languages.map((item, index) => (
                                        <li onClick={() => {changeLanguage(item.code); setLangDropdownIsOpen(false)}} key={index} className={styles.dropdownItem}>
                                            <div className={styles.dropdownItem__text}>
                                                <img alt={item.name} src={item.icon}/>
                                                {item.name}
                                            </div>
                                        </li>
                                    ))}
                                </Dropdown>

                                <Dropdown isOpen={themeDropdownIsOpen} setIsOpen={setThemeDropdownIsOpen} customButtonClass={styles.dropdownButton} buttonContent={
                                    (() => {
                                        const item = themes.find((item) => item.code === theme);
                                        if (!item) {
                                            setTheme('system');
                                            return (
                                                <>
                                                    <SunMoon />
                                                    System
                                                </>
                                            )
                                        }
                                        return (
                                            <>
                                                {item.icon}
                                                {t("settings." + item.code + "_theme")}
                                            </>
                                        );
                                    })()
                                }>

                                    {themes.map((item, index) => (
                                        <li onClick={() => {setTheme(item.code); applyTheme(item.code); setThemeDropdownIsOpen(false)}} key={index} className={styles.dropdownItem}>
                                            <div className={styles.dropdownItem__text}>
                                                {item.icon}
                                                {t("settings." + item.code + "_theme")}
                                            </div>
                                        </li>
                                    ))}
                                </Dropdown>
                            </div>
                        </motion.div>
                    </FocusTrap>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SettingsModal;