import { AppDataSource } from '../startup/data-source';
import { Request } from 'express';
import { Review } from '../entities/Review';
import { SelectQueryBuilder } from 'typeorm';

const reviewRepository = AppDataSource.getRepository(Review);

const START_PAGE = 1;
const DEFAULT_PAGE_SIZE = 40;
const MAX_PAGE_SIZE = 40;

const addIsLikedSelect = (queryBuilder: SelectQueryBuilder<Review>, userId: number | undefined) => {
    if (userId) {
        const subQuery = queryBuilder
            .subQuery()
            .select('1')
            .from('review_likes', 'rl')
            .where('rl.reviewId = review.id')
            .andWhere('rl.userId = :userId')
            .getQuery();

        queryBuilder.addSelect(`EXISTS(${subQuery})`, 'isLiked');
        queryBuilder.setParameter('userId', userId);
    } else {
        queryBuilder.addSelect('false', 'isLiked');
    }
};

const addLikeCountSelect = (queryBuilder: SelectQueryBuilder<Review>) => {
    queryBuilder.leftJoin('review.likes', 'like').addSelect('COUNT(like.id)', 'likeCount').groupBy('review.id');
};

const addMovieSelect = (queryBuilder: SelectQueryBuilder<Review>) => {
    queryBuilder.leftJoin('review.movie', 'movie').addSelect(['movie.id', 'movie.title', 'movie.posterPath', 'movie.releaseDate']);
};

const addUserSelect = (queryBuilder: SelectQueryBuilder<Review>) => {
    queryBuilder.leftJoin('review.author', 'author').addSelect(['author.id', 'author.username']);
};

const addFilterBy = (queryBuilder: SelectQueryBuilder<Review>, filterBy: string | undefined) => {
    if (filterBy === 'popularThisWeek') {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        queryBuilder.andWhere('review.createdAt >= :oneWeekAgo', { oneWeekAgo }).orderBy('likeCount', 'DESC');
    }
};

const getReviewQueryBuilder = async (req: Request) => {
    const queryBuilder = reviewRepository.createQueryBuilder('review');

    const userId = req.session.user ? req.session.user.id : undefined;

    addLikeCountSelect(queryBuilder);
    addIsLikedSelect(queryBuilder, userId);
    addMovieSelect(queryBuilder);
    addUserSelect(queryBuilder);

    const filterBy = req.query.filterBy ? String(req.query.filterBy) : undefined;
    addFilterBy(queryBuilder, filterBy);

    return queryBuilder;
};

export const getReviews = async (req: Request) => {
    const page = req.query.page ? Number(req.query.page) : START_PAGE;
    let pageSize = req.query.pageSize ? Number(req.query.pageSize) : DEFAULT_PAGE_SIZE;

    if (pageSize > MAX_PAGE_SIZE) pageSize = MAX_PAGE_SIZE;

    const queryBuilder = await getReviewQueryBuilder(req);

    try {
        queryBuilder.skip((page - 1) * pageSize).take(pageSize);

        const { entities, raw } = await queryBuilder.getRawAndEntities();

        const total = await queryBuilder.getCount();

        const reviews = entities.map((review, index) => {
            const likeCount = parseInt(raw[index]?.likeCount || 0, 10);
            review.likeCount = likeCount;
            review.isLiked = raw[index]?.isLiked === 1 || raw[index]?.isLiked === true;
            return review;
        });

        return { reviews, total };
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
};

export const deleteReviewById = async (reviewId: number) => {
    try {
        const deleteResult = await reviewRepository.delete(reviewId);
        return deleteResult.affected && deleteResult.affected > 0;
    } catch (error) {
        throw new Error(`Error deleting review with ID ${reviewId}: ${error}`);
    }
};
