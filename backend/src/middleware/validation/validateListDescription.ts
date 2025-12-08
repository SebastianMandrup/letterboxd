export default (description: string): string => {
    const sanitizedDescription = description?.trim();

    if (!sanitizedDescription || typeof sanitizedDescription !== 'string') {
        throw new Error('List description is required and must be a string.');
    }

    if (sanitizedDescription.length > 254) {
        throw new Error('List description must be less than 254 characters long.');
    }

    return sanitizedDescription;
};
