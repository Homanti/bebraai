import styles from './Header.module.scss';
import { models } from "../../../../data/models.tsx";
import { useSidebar } from "../../../../store/sidebar.tsx";
import SvgButton from "../../../../components/SvgButton/SvgButton.tsx";
import {Menu, Image, ImageOff, Settings2} from "lucide-react";
import {useSettings, useSettingsStore} from "../../../../store/settings.tsx";
import {AnimatePresence, motion} from "motion/react";
import {type RefObject, useState} from "react";
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

    const handleSelect = (value: string) => {
        setIsOpen(false);
        setModelName(value);
    };

    return (
        <motion.header className={styles.header} layout>
            <div className={styles.toolbar}>
                <AnimatePresence mode={"popLayout"}>
                    {!sidebarOpened && (
                        <motion.div
                            // initial={{opacity: 0, x: -50}}
                            // animate={{opacity: 1, x: 0}}
                            // exit={{opacity: 0, x: -10}}
                            // layout
                        >
                            <SvgButton onClick={() => setSidebarOpened(!sidebarOpened)}>
                                <Menu />
                            </SvgButton>
                        </motion.div>
                    )}
                </AnimatePresence>

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
                <SvgButton ref={openSettingsButtonRef as RefObject<HTMLButtonElement>}
                           onClick={() => setSettingsOpened(!settingsOpened)}>
                    <Settings2/>
                </SvgButton>
            </motion.div>
        </motion.header>
    );
}

export default Header;