import type { FunctionComponent } from 'react';

interface EyeIconProps {
    size: number;
    color?: string;
}

const EyeIcon: FunctionComponent<EyeIconProps> = ({ size, color = 'currentColor' }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill={color} viewBox="0 0 24 24" width={size} height={size}>
            <path
                d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5
           5 2.239 5 5-2.239 5-5 5zm0-8c-1.654 0-3 1.346-3 3s1.346 3 3 3
           3-1.346 3-3-1.346-3-3-3z"
            />
        </svg>
    );
};

export default EyeIcon;
