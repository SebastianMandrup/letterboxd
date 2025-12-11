import { Request, Response, NextFunction } from 'express';
import validateListName from './validation/validateListName';
import validateListDescription from './validation/validateListDescription';
import validateListMovieIds from './validation/validateListMovieIds';

export const validateListCreation = (req: Request, res: Response, next: NextFunction) => {
    try {
        let { name, description, movieIds } = req.body;

        name = validateListName(name);
        description = validateListDescription(description);
        movieIds = validateListMovieIds(movieIds);

        req.body.name = name;
        req.body.description = description;
        req.body.movieIds = movieIds;

        next();
    } catch (error) {
        next(error);
    }
};
