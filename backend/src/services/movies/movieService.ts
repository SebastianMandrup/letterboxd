import { AppDataSource } from '../../data-source';
import { Movie } from '../../entities/Movie';
import addFeaturedFilter from './addFeaturedFilter';
import addPopularThisWeekFilter from './addPopularThisWeekFilter';
import addDecadeFilter from './addDecadeFilter';
import addRatingFilter from './addRatingFilter';
import addGenreFilter from './addGenreFilter';
import addJustReviewedFilter from './addJustReviewedFilter';
import addTitleFilter from './addTitleFilter';
import { Request } from 'express';
import addCrewPicksFilter from './addCrewPicksFilter';

const movieRepository = AppDataSource.getRepository(Movie);

const START_PAGE = 1;
const DEFAULT_PAGE_SIZE = 40;
const MAX_PAGE_SIZE = 40;

const getMoviesQueryBuilder = async (req: Request) => {
  const queryBuilder = movieRepository.createQueryBuilder('movie');

  const featured = req.query.featured ? Boolean(req.query.featured) : undefined;
  const justReviewed = req.query.justReviewed
    ? Boolean(req.query.justReviewed)
    : undefined;
  const popularThisWeek = req.query.popularThisWeek
    ? Boolean(req.query.popularThisWeek)
    : undefined;
  const decade = req.query.decade ? String(req.query.decade) : undefined;
  const rating = req.query.rating ? String(req.query.rating) : undefined;
  const genre = req.query.genre ? String(req.query.genre) : undefined;
  const title = req.query.title ? String(req.query.title) : undefined;
  const crewPicks = req.query.crewPicks
    ? Boolean(req.query.crewPicks)
    : undefined;

  addTitleFilter(queryBuilder, title);
  addCrewPicksFilter(queryBuilder, crewPicks);
  addFeaturedFilter(queryBuilder, featured);
  addJustReviewedFilter(queryBuilder, justReviewed);
  addPopularThisWeekFilter(queryBuilder, popularThisWeek);
  addDecadeFilter(queryBuilder, decade);
  addRatingFilter(queryBuilder, rating);
  addGenreFilter(queryBuilder, genre);

  return queryBuilder;
};

export const getMovieBySlug = async (slug: string) => {
  return await movieRepository
    .createQueryBuilder('cmovie')
    .where('cmovie.slug = :slug', { slug })
    .leftJoinAndSelect('cmovie.reviews', 'review')
    .loadRelationCountAndMap('review.likeCount', 'review.likes')
    .leftJoinAndSelect('review.movie', 'movie')
    .leftJoin('review.author', 'author')
    .addSelect(['author.id', 'author.username'])
    .leftJoinAndSelect('cmovie.lists', 'list')
    .loadRelationCountAndMap('list.likeCount', 'list.likes')
    .loadRelationCountAndMap('list.commentCount', 'list.comments')
    .leftJoinAndSelect('list.movies', 'movies')
    .leftJoin('list.user', 'user')
    .addSelect(['user.id', 'user.username'])
    .getOne();
};

export const getMovies = async (req: Request) => {
  const page = req.query.page ? Number(req.query.page) : START_PAGE;
  let pageSize = req.query.pageSize
    ? Number(req.query.pageSize)
    : DEFAULT_PAGE_SIZE;

  if (pageSize > MAX_PAGE_SIZE) pageSize = MAX_PAGE_SIZE;

  const queryBuilder = await getMoviesQueryBuilder(req);

  try {
    queryBuilder.skip((page - 1) * pageSize).take(pageSize);

    const [movies, total] = await queryBuilder.getManyAndCount();

    return { movies, total };
  } catch (error) {
    console.error('Error fetching movies:', error);
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
