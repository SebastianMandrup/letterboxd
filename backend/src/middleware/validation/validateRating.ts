export default (rating: number) => {
    if (typeof rating !== 'number' || isNaN(rating)) {
        throw new Error('Rating must be a number');
    }

    if (rating % 0.5 !== 0) {
        throw new Error('Rating must be in increments of 0.5');
    }

    if (rating < 0 || rating > 5) {
        throw new Error('Rating must be between 0 and 5');
    }

    return rating;
};
