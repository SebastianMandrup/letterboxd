import type { FunctionComponent } from 'react';

interface ListIconProps {
    size: number;
    color?: string;
}

const ListIcon: FunctionComponent<ListIconProps> = ({ size, color = 'currentColor' }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="List">
            <path
                d="M4 6h2v2H4V6zm0 5h2v2H4v-2zm0 
           5h2v2H4v-2zm4-10h12v2H8V6zm0 
           5h12v2H8v-2zm0 5h12v2H8v-2z"
                fill={color}
            />
        </svg>
    );
};

export default ListIcon;
