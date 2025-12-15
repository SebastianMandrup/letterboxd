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

const addIsFollowed = (queryBuilder: SelectQueryBuilder<User>, currentUserId: number | undefined) => {
    if (!currentUserId) {
        queryBuilder.addSelect('0', 'isFollowed');
    } else {
        const mainAlias = queryBuilder.alias;
        queryBuilder
            .leftJoin('user_following', 'uf', `uf.following_id = ${mainAlias}.id AND uf.follower_id = :currentUserId`, { currentUserId })
            .addSelect('CASE WHEN uf.follower_id IS NOT NULL THEN 1 ELSE 0 END', 'isFollowed');
    }
    return queryBuilder;
};

const addUserAggregationsSafe = (queryBuilder: SelectQueryBuilder<User>) => {
    const mainAlias = queryBuilder.alias;

    const reviewsSubQuery = queryBuilder.connection
        .createQueryBuilder()
        .select('COUNT(DISTINCT r.id)', 'count')
        .from('reviews', 'r')
        .where(`r.authorId = ${mainAlias}.id`)
        .getQuery();

    const viewsSubQuery = queryBuilder.connection
        .createQueryBuilder()
        .select('COUNT(DISTINCT v.id)', 'count')
        .from('views', 'v')
        .where(`v.userId = ${mainAlias}.id`)
        .getQuery();

    const likesSubQuery = queryBuilder.connection
        .createQueryBuilder()
        .select('COUNT(DISTINCT rl.id)', 'count')
        .from('review_likes', 'rl')
        .innerJoin('reviews', 'r', 'r.id = rl.reviewId')
        .where(`r.authorId = ${mainAlias}.id`)
        .getQuery();

    queryBuilder
        .addSelect(`(${reviewsSubQuery})`, 'numberOfReviews')
        .addSelect(`(${viewsSubQuery})`, 'numberOfWatchedFilms')
        .addSelect(`(${likesSubQuery})`, 'reviewLikeCount');

    return queryBuilder;
};

const addUserFilter = (queryBuilder: SelectQueryBuilder<User>, filterBy: string) => {
    if (filterBy === 'popularReviewers') {
        queryBuilder.orderBy('reviewLikeCount', 'DESC');
    } else if (filterBy === 'featured') {
        queryBuilder
            .where('user.id IN (:...featuredIds)', {
                featuredIds: FEATURED_USER_IDS,
            })
            .orderBy('reviewLikeCount', 'DESC');
    } else if (filterBy === 'hq') {
        queryBuilder.where('user.id IN (:...hqIds)', { hqIds: HQ_USER_IDS }).orderBy('reviewLikeCount', 'DESC');
    }
    return queryBuilder;
};

const addSorting = (queryBuilder: SelectQueryBuilder<User>, sortBy: string) => {
    if (sortBy === 'popular') {
        queryBuilder.orderBy('reviewLikeCount', 'DESC');
    }
    return queryBuilder;
};

const getUserQueryBuilder = async (req: Request, userId: number | undefined = undefined) => {
    const queryBuilder = userRepository.createQueryBuilder('user');

    // Try different versions to see which works
    addUserAggregationsSafe(queryBuilder); // Try the safe option first
    addIsFollowed(queryBuilder, userId);

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

export const getUsers = async (req: Request, userId: number | undefined = undefined) => {
    const page = req.query.page ? Number(req.query.page) : START_PAGE;
    let pageSize = req.query.pageSize ? Number(req.query.pageSize) : DEFAULT_PAGE_SIZE;

    if (pageSize > MAX_PAGE_SIZE) pageSize = MAX_PAGE_SIZE;

    const queryBuilder = await getUserQueryBuilder(req, userId);

    try {
        queryBuilder.skip((page - 1) * pageSize).take(pageSize);

        const { entities: users, raw } = await queryBuilder.getRawAndEntities();

        // Get total count separately
        const totalQueryBuilder = await getUserQueryBuilder(req, userId);
        const total = await totalQueryBuilder.getCount();

        // Map raw data to entities
        users.forEach((user, index) => {
            if (raw[index]) {
                user.numberOfReviews = parseInt(raw[index].numberOfReviews || '0', 10);
                user.numberOfWatchedFilms = parseInt(raw[index].numberOfWatchedFilms || '0', 10);
                user.reviewLikeCount = parseInt(raw[index].reviewLikeCount || '0', 10);
                user.isFollowed = raw[index].isFollowed === 1 || raw[index].isFollowed === true;
            }
        });

        return { users, total };
    } catch (error) {
        console.error('Error fetching users:', error);

        // Debug: Check the actual table structure
        try {
            const reviewColumns = await AppDataSource.query('SHOW COLUMNS FROM reviews');
            console.log('Reviews table columns:', reviewColumns);

            const viewColumns = await AppDataSource.query('SHOW COLUMNS FROM views');
            console.log('Views table columns:', viewColumns);
        } catch (debugError) {
            console.error('Debug error:', debugError);
        }

        return { users: [], total: 0 };
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addLikeStatsToReviews = async (reviews: any[], currentUserId: number | undefined) => {
    if (!reviews || reviews.length === 0) return reviews;

    const reviewIds = reviews.map((review) => review.id);

    const query = userRepository.manager
        .createQueryBuilder()
        .from('reviews', 'r')
        .select(['r.id as reviewId', 'COUNT(DISTINCT rl.id) as likeCount'])
        .leftJoin('review_likes', 'rl', 'rl.reviewId = r.id')
        .where('r.id IN (:...reviewIds)', { reviewIds })
        .groupBy('r.id');

    // Add isLiked calculation if we have a current user
    if (currentUserId) {
        query.addSelect(
            `
            CASE 
                WHEN EXISTS(
                    SELECT 1 
                    FROM review_likes rl2 
                    WHERE rl2.reviewId = r.id 
                    AND rl2.userId = :currentUserId
                ) THEN 1 
                ELSE 0 
            END`,
            'isLiked',
        );
        query.setParameter('currentUserId', currentUserId);
    } else {
        query.addSelect('0', 'isLiked');
    }

    const reviewStats = await query.getRawMany();

    // Create a map for easy lookup
    const statsMap = new Map();
    reviewStats.forEach((stat) => {
        statsMap.set(stat.reviewId, {
            likeCount: parseInt(stat.likeCount || '0', 10),
            isLiked: stat.isLiked === 1 || stat.isLiked === true,
        });
    });

    // Add stats to each review
    return reviews.map((review) => {
        const stats = statsMap.get(review.id);
        return {
            ...review,
            likeCount: stats?.likeCount || 0,
            isLiked: stats?.isLiked || false,
        };
    });
};

export const getUserByUsername = async (username: string, currentUserId: number | undefined = undefined) => {
    const queryBuilder = userRepository.createQueryBuilder('user');

    queryBuilder
        .select(['user.id', 'user.username', 'user.role', 'user.createdAt', 'user.bio'])
        .leftJoinAndSelect('user.lists', 'list')
        .leftJoin('list.user', 'listUser')
        .addSelect(['listUser.id', 'listUser.username'])
        .leftJoinAndSelect('list.movies', 'movie')
        .leftJoinAndSelect('user.reviews', 'review')
        .leftJoinAndSelect('review.movie', 'reviewMovie')
        .leftJoinAndSelect('review.author', 'reviewAuthor')
        .addSelect(['reviewAuthor.id', 'reviewAuthor.username'])
        .leftJoinAndSelect('user.views', 'view')
        .leftJoinAndSelect('view.movie', 'viewMovie')
        .where('user.username = :username', { username })
        .orderBy('list.createdAt', 'DESC')
        .addOrderBy('review.createdAt', 'DESC')
        .addOrderBy('view.viewedAt', 'DESC');

    addIsFollowed(queryBuilder, currentUserId);

    const { raw, entities } = await queryBuilder.getRawAndEntities();
    const user = entities[0];

    if (!user) {
        return null;
    }

    user.isFollowed = raw[0]?.isFollowed === 1;

    // Enhance reviews with like stats
    if (user.reviews) {
        user.reviews = await addLikeStatsToReviews(user.reviews, currentUserId);
    }

    return user;
};

export const deleteUserById = async (userId: number) => {
    try {
        const deleteResult = await userRepository.delete(userId);
        return deleteResult.affected && deleteResult.affected > 0;
    } catch (error) {
        throw new Error(`Error deleting user with ID ${userId}: ${error}`);
    }
};
