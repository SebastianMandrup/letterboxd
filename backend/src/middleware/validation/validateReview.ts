export default (review: string) => {
    if (typeof review !== 'string' || review.length === 0) {
        throw new Error('Review content must be a non-empty string');
    }

    review = review.trim();

    if (review.length < 10) {
        throw new Error('Review content must be at least 10 characters long');
    }

    if (review.length > 255) {
        throw new Error('Review content must not exceed 5000 characters');
    }

    return review;
};
