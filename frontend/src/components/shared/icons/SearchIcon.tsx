import type { FunctionComponent } from 'react';

interface SearchIconProps {
    size: number;
}

const SearchIcon: FunctionComponent<SearchIconProps> = ({ size }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="8" cy="8" r="6" />
            <line x1="15" y1="15" x2="11.5" y2="11.5" />
        </svg>
    );
};

export default SearchIcon;
