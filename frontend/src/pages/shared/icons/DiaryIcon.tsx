import type { FunctionComponent } from 'react';

interface DiaryIconProps {
    size: number;
    color?: string;
}

const DiaryIcon: FunctionComponent<DiaryIconProps> = ({ size, color = 'currentColor' }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="Diary">
            <path
                d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 
           2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 
           18H6V4h12v16z"
                fill={color}
            />
        </svg>
    );
};

export default DiaryIcon;
