export default (movieIds: number[]): number[] => {
    if (!Array.isArray(movieIds)) {
        throw new Error('List movie IDs are required and must be an array.');
    }

    if (movieIds.length > 40) {
        throw new Error('List movie IDs must contain 40 or fewer items.');
    }

    return movieIds;
};
