import type { JSX } from 'react';

interface ButtonLetterboxLetsYouProps {
    svg: JSX.Element;
    text: string;
}

function ButtonLetterboxLetsYou({ svg, text }: ButtonLetterboxLetsYouProps) {
    return (
        <button >
            {svg}
            {text}
        </ button>
    );
}

export default ButtonLetterboxLetsYou;