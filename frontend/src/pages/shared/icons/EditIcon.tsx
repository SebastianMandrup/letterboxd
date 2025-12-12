import type { FunctionComponent } from 'react';

interface EditIconProps {
    size: number;
    color?: string;
}

const EditIcon: FunctionComponent<EditIconProps> = ({ size, color = 'currentColor' }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="Edit">
            <path
                d="M3 17.25V21h3.75l11-11.03-3.75-3.75L3 17.25zM20.71 
           7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34
           a1.003 1.003 0 0 0-1.42 0l-1.83 1.83
           3.75 3.75 1.84-1.82z"
                fill={color}
            />
        </svg>
    );
};

export default EditIcon;
