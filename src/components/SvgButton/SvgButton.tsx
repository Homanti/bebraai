import type { ReactNode, MouseEvent, ButtonHTMLAttributes } from "react";
import styles from "./SvgButton.module.scss";

type Props = {
    children: ReactNode;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    type?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const SvgButton = ({ children, onClick, className, type = "button", ...rest }: Props) => {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick(e);
            }}
            className={`${styles.SvgButton} ${className ? ` ${className}` : ""}`}
            type={type}
            {...rest}
        >
            {children}
        </button>
    );
};

export default SvgButton;