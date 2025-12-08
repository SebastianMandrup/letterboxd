import { MuoError } from '../errorHandler';

export default (id: number) => {
    if (!Number.isInteger(id) || id <= 0) {
        throw new MuoError('Invalid primary key', 400);
    }

    return id;
};
