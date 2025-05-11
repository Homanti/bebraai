import type { ReactNode, MouseEvent } from "react";
import styles from "./SvgButton.module.scss";

type Props = {
    children: ReactNode;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    className?: string;
};

const SvgButton = ({ children, onClick, className }: Props) => {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick(e);
            }}
            className={`${styles.SvgButton} ${className}`}>
            {children}
        </button>
    );
};

export default SvgButton;