import type { FunctionComponent } from 'react';

const Heart: FunctionComponent = () => {
    return (
        <svg viewBox="0 0 24 24" role="img">
            <path
                d="M12 21.4s-6.7-4.6-9.3-7.3C.9 11.9 1 7.9 4.3 5.9 6.1 4.7 8.4 5 10 6.3c.9.8 1.6 1.6 2 2 .4-.4 1.1-1.2 2-2 1.6-1.3 3.9-1.6 5.7-.4 3.3 2 3.4 6 1.6 8.2-2.6 2.7-9.3 7.3-9.3 7.3z"
                fill="currentColor"
            ></path>
        </svg>
    );
};

export default Heart;
