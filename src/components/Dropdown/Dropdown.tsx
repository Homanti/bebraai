import { useState } from 'react';
import styles from './Dropdown.module.scss';
import { AnimatePresence, motion } from "motion/react";

type DropdownProps = {
    children: string[];
    onSelect: (value: string) => void;
    value?: string;
};

const Dropdown = ({ children, onSelect, value }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(value || children[0]);

    const handleSelect = (value: string) => {
        setSelected(value);
        setIsOpen(false);
        onSelect(value);
    };

    return (
        <div className={styles.dropdown}>
            <button onClick={() => setIsOpen(!isOpen)} className={styles.button}>
                {selected}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        className={styles.content}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        {children.map((item, index) => (
                            <li onClick={() => handleSelect(item)} key={index} className={styles.item}>
                                {item}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dropdown;
