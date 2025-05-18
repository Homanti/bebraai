import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useClickOutside } from "../../hooks/useClickOutside.tsx";
import styles from "./Dropdown.module.scss";

export type DropdownProps = {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    buttonContent: React.ReactNode;
    children: React.ReactNode;
    customButtonClass?: string;
    customContentClass?: string;
};

const Dropdown = ({ isOpen, setIsOpen, buttonContent, children, customButtonClass, customContentClass }: DropdownProps) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

    return (
        <div className={`${styles.dropdown}`} ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className={`${styles.dropdownButton} ${customButtonClass || ""}`}>
                {buttonContent}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        className={`${styles.dropdownContent} ${customContentClass || ""}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        {children}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dropdown;
