import { ApiError } from '../../interfaces/ApiError';

export default (id: number) => {
    if (!Number.isInteger(id) || id <= 0) {
        throw new ApiError('Invalid primary key', 400);
    }

    return id;
};
