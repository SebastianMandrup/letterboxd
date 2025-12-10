import { useState, useRef } from 'react';
import styles from './starRating.module.css';

interface StarRatingProps {
    value?: number;
    onChange?: (value: number) => void;
    disabled?: boolean;
    size?: number;
    allowHalfStars?: boolean;
}

const StarRating = ({ value = 0, onChange, disabled = false, size = 32, allowHalfStars = true }: StarRatingProps) => {
    const [hoverRating, setHoverRating] = useState(0);
    const starRefs = useRef<(HTMLButtonElement | null)[]>([]);

    if (starRefs.current.length !== 5) {
        starRefs.current = Array(5).fill(null);
    }

    const getStarValue = (e: React.MouseEvent, index: number): number => {
        if (!allowHalfStars) return index;

        const starElement = starRefs.current[index - 1];
        if (!starElement) return index;

        const rect = starElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;

        if (x < width / 2) {
            return index - 0.5;
        }
        return index;
    };

    const handleMouseMove = (e: React.MouseEvent, index: number) => {
        if (disabled) return;
        const starValue = getStarValue(e, index);
        setHoverRating(starValue);
    };

    const handleMouseLeave = () => {
        if (!disabled) {
            setHoverRating(0);
        }
    };

    const handleClick = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        if (disabled || !onChange) return;
        const starValue = getStarValue(e, index);
        onChange(starValue);
    };

    const renderStar = (starIndex: number) => {
        const displayRating = hoverRating || value;
        const isFull = displayRating >= starIndex;
        const isHalf = allowHalfStars && displayRating >= starIndex - 0.5 && displayRating < starIndex;

        return (
            <button
                type="button"
                key={starIndex}
                ref={(el) => {
                    starRefs.current[starIndex - 1] = el;
                }}
                className={styles.starWrapper}
                onMouseMove={(e) => handleMouseMove(e, starIndex)}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => handleClick(e, starIndex)}
                style={{
                    cursor: disabled ? 'default' : 'pointer',
                    width: size,
                    height: size,
                    position: 'relative',
                }}
                data-star-index={starIndex}
            >
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Unfilled star (background) */}
                    <path
                        className={styles.starBackground}
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="#e4e5e9"
                    />

                    {/* Filled portion - conditionally rendered */}
                    {isFull && (
                        <path
                            className={styles.starFill}
                            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                            fill="#ffc107"
                        />
                    )}

                    {isHalf && (
                        <path
                            className={styles.starFill}
                            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                            fill="#ffc107"
                            clipPath="inset(0 50% 0 0)"
                        />
                    )}
                </svg>
            </button>
        );
    };

    return (
        <div className={styles.ratingContainer}>
            <div className={styles.starsGroup}>{[1, 2, 3, 4, 5].map((index) => renderStar(index))}</div>
        </div>
    );
};

export default StarRating;
