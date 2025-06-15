import styles from './Header.module.scss';
import { models } from "../../../../data/models.tsx";
import { useSidebar } from "../../../../store/sidebar.tsx";
import SvgButton from "../../../../components/SvgButton/SvgButton.tsx";
import {Menu, Image, ImageOff, Settings2} from "lucide-react";
import {useSettings, useSettingsStore} from "../../../../store/settings.tsx";
import {motion} from "motion/react";
import {type RefObject, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Dropdown from "../../../../components/Dropdown/Dropdown.tsx";

type HeaderProps = {
    openSettingsButtonRef: RefObject<HTMLButtonElement | null>;
};

const Header = ({ openSettingsButtonRef }: HeaderProps) => {
    const { sidebarOpened, setSidebarOpened } = useSidebar();
    const { modelName, setModelName } = useSettingsStore();
    const [isOpen, setIsOpen] = useState(false);
    const { settingsOpened, setSettingsOpened } = useSettings();
    const { t } = useTranslation();
    const [width, setWidth] = useState(window.innerWidth);
    const isMobile = width <= 768;

    const handleSelect = (value: string) => {
        setIsOpen(false);
        setModelName(value);
    };

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <motion.header className={styles.header} layout>
            <div className={styles.toolbar}>
                {!isMobile ? (
                    <>
                        {!sidebarOpened && (
                            <div>
                                <SvgButton onClick={() => setSidebarOpened(!sidebarOpened)} aria-expanded={sidebarOpened} aria-label={t("aria.button_open_sidebar")} title={t("aria.button_open_sidebar")} aria-controls={"sidebar-content"}>
                                    <Menu />
                                </SvgButton>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div>
                            <SvgButton onClick={() => setSidebarOpened(!sidebarOpened)} aria-expanded={sidebarOpened} aria-label={t("aria.button_open_sidebar")} title={t("aria.button_open_sidebar")} aria-controls={"sidebar-content"}>
                                <Menu />
                            </SvgButton>
                        </div>
                    </>
                )}

                <Dropdown isOpen={isOpen} setIsOpen={setIsOpen} buttonContent={modelName} customButtonClass={styles.dropdownButton} customContentClass={styles.dropdownContent}>
                    {models.map((item, index) => (
                        <li onClick={() => handleSelect(item.name)} key={index} className={styles.dropdownItem}>
                            <div className={styles.dropdownItem__text}>
                                {item.name}
                                {<p className={styles.description}>{t(item.description)}</p>}
                            </div>
                            {item.visionSupport ? (
                                <Image />
                            ) : (
                                <ImageOff />
                            )}
                        </li>
                    ))}
                </Dropdown>
            </div>

            <motion.div layout>
                <SvgButton ref={openSettingsButtonRef as RefObject<HTMLButtonElement>} onClick={() => setSettingsOpened(!settingsOpened)} aria-controls={"settings-content"} aria-expanded={settingsOpened} aria-label={t("aria.button_open_settings")} title={t("aria.button_open_settings")}>
                    <Settings2/>
                </SvgButton>
            </motion.div>
        </motion.header>
    );
}

export default Header;