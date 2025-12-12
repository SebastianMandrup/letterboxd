import type { JSX } from 'react';
import styles from './buttonLetterboxdLetsYou.module.css';

interface ButtonLetterboxLetsYouProps {
    svg: JSX.Element;
    text: string;
}

function ButtonLetterboxLetsYou({ svg, text }: ButtonLetterboxLetsYouProps) {
    return (
        <button title={text} className={styles.button}>
            {svg}
            <p className={styles.text}>{text}</p>
        </button>
    );
}

export default ButtonLetterboxLetsYou;
