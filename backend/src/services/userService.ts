import { SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '../startup/data-source';
import { User } from '../entities/User';
import { Request } from 'express';

const userRepository = AppDataSource.getRepository(User);

const START_PAGE = 1;
const DEFAULT_PAGE_SIZE = 40;
const MAX_PAGE_SIZE = 40;
const FEATURED_USER_IDS = [1, 2, 3, 4, 5];
const HQ_USER_IDS = [6, 7, 8, 9, 10, 13, 14, 15];

const addNumberOfWatchedFilms = (queryBuilder: SelectQueryBuilder<User>) => {
  queryBuilder
    .leftJoin('user.views', 'view')
    .addSelect('COUNT(DISTINCT view.id)', 'numberOfWatchedFilms')
    .groupBy('user.id');
};

const addNumberOfReviews = (queryBuilder: SelectQueryBuilder<User>) => {
  queryBuilder
    .leftJoin('user.reviews', 'reviewCount')
    .addSelect('COUNT(DISTINCT reviewCount.id)', 'numberOfReviews')
    .groupBy('user.id');
};

const addReviewLikeCount = (queryBuilder: SelectQueryBuilder<User>) => {
  queryBuilder
    .leftJoin('user.reviews', 'review')
    .leftJoin('review.likes', 'reviewLike')
    .addSelect('COUNT(DISTINCT reviewLike.id)', 'reviewLikeCount')
    .groupBy('user.id');
};

// const addRecentlyReviewedMovies = (queryBuilder: SelectQueryBuilder<User>) => {
//   queryBuilder
//     .leftJoinAndSelect('user.reviews', 'recentReview', 'recentReview.createdAt >= NOW() - INTERVAL \'30 days\'')
//     .leftJoinAndSelect('recentReview.movie', 'recentReviewedMovie')
//     .limit(5);
// };

const addUserFilter = (
  queryBuilder: SelectQueryBuilder<User>,
  filterBy: string,
) => {
  if (filterBy === 'popularReviewers') {
    queryBuilder.orderBy('reviewLikeCount', 'DESC');
  } else if (filterBy === 'featured') {
    queryBuilder
      .where('user.id IN (:...featuredIds)', { featuredIds: FEATURED_USER_IDS })
      .orderBy('reviewLikeCount', 'DESC');
  } else if (filterBy === 'hq') {
    queryBuilder
      .where('user.id IN (:...hqIds)', { hqIds: HQ_USER_IDS })
      .orderBy('reviewLikeCount', 'DESC');
  }
};

const addSorting = (queryBuilder: SelectQueryBuilder<User>, sortBy: string) => {
  if (sortBy === 'popular') {
    queryBuilder.orderBy('reviewLikeCount', 'DESC');
  }
};

const getUserQueryBuilder = async (req: Request) => {
  const queryBuilder = userRepository.createQueryBuilder('user');

  addNumberOfReviews(queryBuilder);
  addNumberOfWatchedFilms(queryBuilder);
  addReviewLikeCount(queryBuilder);
  // addRecentlyReviewedMovies(queryBuilder);

  const filterBy = req.query.filterBy ? String(req.query.filterBy) : undefined;
  if (filterBy) {
    addUserFilter(queryBuilder, filterBy);
  }

  const sortBy = req.query.sortBy ? String(req.query.sortBy) : undefined;
  if (sortBy) {
    addSorting(queryBuilder, sortBy);
  }

  return queryBuilder;
};

export const getUsers = async (req: Request) => {
  const page = req.query.page ? Number(req.query.page) : START_PAGE;
  let pageSize = req.query.pageSize
    ? Number(req.query.pageSize)
    : DEFAULT_PAGE_SIZE;

  if (pageSize > MAX_PAGE_SIZE) pageSize = MAX_PAGE_SIZE;

  const queryBuilder = await getUserQueryBuilder(req);

  try {
    queryBuilder.skip((page - 1) * pageSize).take(pageSize);

    const { entities: users, raw } = await queryBuilder.getRawAndEntities();

    const total = parseInt(raw[0]?.totalCount || '0', 10) || users.length;

    users.forEach(async (user, index) => {
      user.numberOfReviews = parseInt(raw[index]?.numberOfReviews || 0, 10);
      user.numberOfWatchedFilms = parseInt(
        raw[index]?.numberOfWatchedFilms || 0,
        10,
      );
      user.reviewLikeCount = parseInt(raw[index]?.reviewLikeCount || 0, 10);
    });

    return { users, total };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { users: [], total: 0 };
  }
};

export const getUserByName = async (name: string) => {
  return await userRepository.findOne({ where: { username: name } });
};

export const deleteUserById = async (userId: number) => {
  try {
    const deleteResult = await userRepository.delete(userId);
    return deleteResult.affected && deleteResult.affected > 0;
  } catch (error) {
    throw new Error(`Error deleting user with ID ${userId}: ${error}`);
  }
};
