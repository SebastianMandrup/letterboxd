import { SelectQueryBuilder } from "typeorm";
import { AppDataSource } from "../data-source";
import { Movie } from "../entities/Movie";

const movieRepository = AppDataSource.getRepository(Movie);

const MAX_MOVIES = 40;

const addFeaturedFilter = (
    queryBuilder: SelectQueryBuilder<Movie>,
    featured: boolean | undefined
) => {
    if (featured === true) {
        queryBuilder
            .leftJoinAndSelect("movie.views", "views")
            .addSelect("COUNT(views.id)", "viewsCount")
            .groupBy("movie.id")
            .orderBy("viewsCount", "DESC")
            .limit(6);
    }
};


const addJustReviewedFilter = (
    queryBuilder: SelectQueryBuilder<Movie>,
    justReviewed: boolean | undefined
) => {
    if (justReviewed === true) {
        queryBuilder
            .leftJoinAndSelect("movie.reviews", "review")
            .orderBy("review.createdAt", "DESC")
            .limit(11);
    }
};

export const getMoviesQueryBuilder = async (req: any) => {

    const queryBuilder = movieRepository.createQueryBuilder("movie");

    const featured = req.query.featured ? Boolean(req.query.featured) : undefined;
    const justReviewed = req.query.justReviewed ? Boolean(req.query.justReviewed) : undefined;

    addFeaturedFilter(queryBuilder, featured);
    addJustReviewedFilter(queryBuilder, justReviewed);

    if (!featured && !justReviewed) {
        queryBuilder.limit(MAX_MOVIES);
    }

    return queryBuilder;
}
