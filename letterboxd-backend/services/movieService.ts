import { SelectQueryBuilder } from "typeorm";
import { AppDataSource } from "../data-source";
import { Movie } from "../entities/Movie";

const movieRepository = AppDataSource.getRepository(Movie);

const START_PAGE = 1;
const DEFAULT_PAGE_SIZE = 40;
const MAX_PAGE_SIZE = 40;

const addFeaturedFilter = (
    queryBuilder: SelectQueryBuilder<Movie>,
    featured: boolean | undefined
) => {
    if (featured === true) {
        const FEATURED_MOVIE_IDS = [10, 20, 30, 40, 50, 60];
        queryBuilder.where("movie.id IN (:...ids)", { ids: FEATURED_MOVIE_IDS });
    }
};

const addJustReviewedFilter = (
    queryBuilder: SelectQueryBuilder<Movie>,
    justReviewed: boolean | undefined
) => {
    if (justReviewed === true) {
        queryBuilder
            .leftJoinAndSelect(
                "movie.reviews",
                "review",
                "review.deletedAt IS NULL"
            )
            .orderBy("review.createdAt", "DESC");
    }
};

const addPopularThisWeekFilter = (
    queryBuilder: SelectQueryBuilder<Movie>,
    popularThisWeek: boolean | undefined
) => {
    if (popularThisWeek === true) {
        queryBuilder
            .orderBy("movie.voteAverage", "DESC")
            .take(12);
    }
};

const addDecadeFilter = (
    queryBuilder: SelectQueryBuilder<Movie>,
    decade: string | undefined
) => {
    if (!decade) return;

    if (decade === 'upcoming') {
        const currentDate = new Date();
        queryBuilder.andWhere(
            "movie.releaseDate > :currentDate",
            { currentDate: currentDate.toISOString().split('T')[0] }
        );
        return;
    }

    decade = decade.replace('s', '');
    const startYear = parseInt(decade);
    const endYear = startYear + 9;
    queryBuilder.andWhere(
        "movie.releaseDate BETWEEN :startDate AND :endDate",
        { startDate: `${startYear}-01-01`, endDate: `${endYear}-12-31` }
    );
};

const addRatingFilter = (
    queryBuilder: SelectQueryBuilder<Movie>,
    rating: string | undefined
) => {
    if (!rating) return;

    if (rating === 'lowest') {
        queryBuilder.orderBy("movie.voteAverage", "ASC");
        return;
    }

    if (rating === 'highest') {
        queryBuilder.orderBy("movie.voteAverage", "DESC");
        return;
    }
};

const addGenreFilter = (
    queryBuilder: SelectQueryBuilder<Movie>,
    genre: string | undefined
) => {
    if (!genre) return;

    queryBuilder
        .leftJoin("movie.genres", "genre")
        .andWhere("genre.name = :genreName", { genreName: genre });
};

const addTitleFilter = (
    queryBuilder: SelectQueryBuilder<Movie>,
    title: string | undefined
) => {
    if (!title) return;

    title = title.replace(/-/g, ' ');

    queryBuilder
        .andWhere("LOWER(movie.title) = :title", { title: title.toLowerCase() })
        .leftJoinAndSelect(
            "movie.reviews",
            "review",
            "review.deletedAt IS NULL"
        )
        .leftJoin(
            "review.author",
            "author"
        )
        .addSelect("author.name")
        .leftJoinAndSelect(
            "movie.lists",
            "list"
        )
};

const getMoviesQueryBuilder = async (req: any) => {
    const queryBuilder = movieRepository.createQueryBuilder("movie");

    const featured = req.query.featured ? Boolean(req.query.featured) : undefined;
    const justReviewed = req.query.justReviewed ? Boolean(req.query.justReviewed) : undefined;
    const popularThisWeek = req.query.popularThisWeek ? Boolean(req.query.popularThisWeek) : undefined;
    const decade = req.query.decade ? String(req.query.decade) : undefined;
    const rating = req.query.rating ? String(req.query.rating) : undefined;
    const genre = req.query.genre ? String(req.query.genre) : undefined;
    const title = req.query.title ? String(req.query.title) : undefined;

    addFeaturedFilter(queryBuilder, featured);
    addJustReviewedFilter(queryBuilder, justReviewed);
    addPopularThisWeekFilter(queryBuilder, popularThisWeek);
    addDecadeFilter(queryBuilder, decade);
    addRatingFilter(queryBuilder, rating);
    addGenreFilter(queryBuilder, genre);
    addTitleFilter(queryBuilder, title);

    return queryBuilder;
};

export const getMovies = async (req: any) => {
    const page = req.query.page ? Number(req.query.page) : START_PAGE;
    let pageSize = req.query.pageSize ? Number(req.query.pageSize) : DEFAULT_PAGE_SIZE;

    if (pageSize > MAX_PAGE_SIZE) pageSize = MAX_PAGE_SIZE;

    const queryBuilder = await getMoviesQueryBuilder(req);

    try {
        queryBuilder.skip((page - 1) * pageSize).take(pageSize);

        const [movies, total] = await queryBuilder.getManyAndCount();

        return { movies, total };
    } catch (error) {
        console.error("Error fetching movies:", error);
        return { movies: [], total: 0 };
    }
};

export const deleteMovieById = async (movieId: number) => {
    try {
        const deleteResult = await movieRepository.delete(movieId);
        return deleteResult.affected && deleteResult.affected > 0;
    } catch (error) {
        throw new Error(`Error deleting movie with ID ${movieId}: ${error}`);
    }
};
