import { type ImgHTMLAttributes, useState } from 'react';
import styles from './ImageWithLoader.module.scss';

const ImageWithLoader = ({className = '', ...rest}: ImgHTMLAttributes<HTMLImageElement> & { className?: string }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={styles.imageWrapper}>
            {!loaded && (
                <div className={styles.spinnerWrapper}>
                    <div className={styles.spinner}></div>
                </div>
            )}
            <img
                onLoad={() => setLoaded(true)}
                className={`${className} ${!loaded ? styles.hidden : ''}`}
                {...rest}
            />
        </div>
    );
};

export default ImageWithLoader;