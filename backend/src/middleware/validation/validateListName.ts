export default (name: string): string => {
    if (typeof name !== 'string') {
        throw new Error('List name is required and must be a string.');
    }

    const sanitizedListName = name.trim().toLowerCase();

    if (!sanitizedListName) {
        throw new Error('List name is required and must be a string.');
    }

    if (sanitizedListName.length > 254) {
        throw new Error('List name must be less than 254 characters long.');
    }

    return sanitizedListName;
};
