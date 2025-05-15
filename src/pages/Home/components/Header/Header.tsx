import styles from './Header.module.scss';
import { models } from "../../../../data/models.tsx";
import { useSidebar } from "../../../../store/sidebar.tsx";
import SvgButton from "../../../../components/SvgButton/SvgButton.tsx";
import {Menu, Image, ImageOff} from "lucide-react";
import {useSettingsStore} from "../../../../store/settingsStore.tsx";
import {AnimatePresence, motion} from "motion/react";
import {useState} from "react";

const Header = () => {
    const { sidebarOpened, setSidebarOpened } = useSidebar();
    const { modelName, setModelName } = useSettingsStore();
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (value: string) => {
        setIsOpen(false);
        setModelName(value);
    };

    return (
        <header className={styles.header}>
            {!sidebarOpened && (
                <div>
                    <SvgButton onClick={() => setSidebarOpened(!sidebarOpened)}>
                        <Menu />
                    </SvgButton>
                </div>
            )}

            <div className={styles.dropdown}>
                <button onClick={() => setIsOpen(!isOpen)} className={styles.dropdownButton}>
                    {modelName}
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.ul
                            className={styles.dropdownContent}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            {models.map((item, index) => (
                                <li onClick={() => handleSelect(item.name)} key={index} className={styles.dropdownItem}>
                                    <div className={styles.dropdownItem__text}>
                                        {item.name}
                                        {<p className={styles.description}>{item.description}</p>}
                                    </div>
                                    {item.visionSupport ? (
                                        <Image />
                                    ) : (
                                        <ImageOff />
                                    )}
                                </li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}

export default Header;