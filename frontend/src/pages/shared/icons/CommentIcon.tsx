import type { FunctionComponent } from 'react';

interface CommentIconProps {
    size: number;
    color?: string;
}

const CommentIcon: FunctionComponent<CommentIconProps> = ({ size, color = 'currentColor' }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="Comment">
            <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default CommentIcon;
