import { SelectQueryBuilder } from "typeorm";
import { AppDataSource } from "../data-source";
import { View } from "../entities/View";

const viewRepository = AppDataSource.getRepository(View);

const MAX_VIEWS = 40;

// const addFeaturedFilter = (
//     queryBuilder: SelectQueryBuilder<Movie>,
//     featured: boolean | undefined
// ) => {
//     if (featured === true) {

//         const FEATURED_MOVIE_IDS = [10, 20, 30, 40, 50, 60];
//         queryBuilder.where("movie.id IN (:...ids)", { ids: FEATURED_MOVIE_IDS });
//     }
// };


// const addJustReviewedFilter = (
//     queryBuilder: SelectQueryBuilder<Movie>,
//     justReviewed: boolean | undefined
// ) => {
//     if (justReviewed === true) {
//         queryBuilder
//             .leftJoinAndSelect(
//                 "movie.reviews",
//                 "review",
//                 "review.deletedAt IS NULL"
//             )
//             .orderBy("review.createdAt", "DESC")
//             .take(11);

//     }
// };

// export const getMoviesQueryBuilder = async (req: any) => {

//     const queryBuilder = movieRepository.createQueryBuilder("movie");

//     const featured = req.query.featured ? Boolean(req.query.featured) : undefined;
//     const justReviewed = req.query.justReviewed ? Boolean(req.query.justReviewed) : undefined;

//     addFeaturedFilter(queryBuilder, featured);
//     addJustReviewedFilter(queryBuilder, justReviewed);

//     if (!featured && !justReviewed) {
//         queryBuilder.limit(MAX_MOVIES);
//     }

//     return queryBuilder;
// }
