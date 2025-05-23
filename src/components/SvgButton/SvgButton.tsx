import type {ReactNode, MouseEvent, ButtonHTMLAttributes, RefObject} from "react";
import styles from "./SvgButton.module.scss";

type Props = {
    children: ReactNode;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    type?: string;
    ref?: RefObject<HTMLButtonElement> | null;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const SvgButton = ({ children, onClick, className, type = "button", ref = null, ...rest }: Props) => {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick(e);
            }}
            className={`${styles.SvgButton} ${className ? ` ${className}` : ""}`}
            type={type}
            ref={ref}
            {...rest}
        >
            {children}
        </button>
    );
};

export default SvgButton;