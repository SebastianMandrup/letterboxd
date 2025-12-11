import type { FunctionComponent } from 'react';

interface StarIconProps {
    size: number;
    color?: string;
}

const StarIcon: FunctionComponent<StarIconProps> = ({ size, color = 'currentColor' }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="Star">
            <path
                d="M12 17.27L18.18 21l-1.64-7.03L22 
           9.24l-7.19-.61L12 2 9.19 8.63 
           2 9.24l5.46 4.73L5.82 21z"
                fill={color}
            />
        </svg>
    );
};

export default StarIcon;
