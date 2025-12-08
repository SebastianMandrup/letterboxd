export default (id: number) => {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid primary key');
    }

    return id;
};
