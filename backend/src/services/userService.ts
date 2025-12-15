import { SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '../startup/data-source';
import { User } from '../entities/User';
import { Request } from 'express';
import { List } from '../entities/List';
import { Review } from '../entities/Review';
import { View } from '../entities/View';

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
    // First, get basic user info without relations
    const user = await userRepository
        .createQueryBuilder('user')
        .select(['user.id', 'user.username', 'user.role', 'user.createdAt', 'user.bio'])
        .where('user.username = :username', { username })
        .getOne();

    if (!user) {
        return null;
    }

    const listRepository = AppDataSource.getRepository(List);

    // Get lists with pagination
    const [lists, listCount] = await listRepository
        .createQueryBuilder('list')
        .select(['list', 'listUser.id', 'listUser.username'])
        .leftJoin('list.user', 'listUser')
        .leftJoinAndSelect('list.movies', 'movie')
        .where('list.userId = :userId', { userId: user.id })
        .orderBy('list.createdAt', 'DESC')
        .take(10) // Limit the number of lists
        .skip(0)
        .getManyAndCount();

    // Get lists with counts using separate queries
    const enhancedLists = await Promise.all(
        lists.map(async (list) => {
            const [likeCount, commentCount] = await Promise.all([
                listRepository
                    .createQueryBuilder('list')
                    .leftJoin('list.likes', 'like')
                    .where('list.id = :listId', { listId: list.id })
                    .select('COUNT(DISTINCT like.id)', 'count')
                    .getRawOne()
                    .then((result) => parseInt(result?.count || '0')),
                listRepository
                    .createQueryBuilder('list')
                    .leftJoin('list.comments', 'comment')
                    .where('list.id = :listId', { listId: list.id })
                    .select('COUNT(DISTINCT comment.id)', 'count')
                    .getRawOne()
                    .then((result) => parseInt(result?.count || '0')),
            ]);

            return {
                ...list,
                likeCount,
                commentCount,
            };
        }),
    );

    const reviewRepository = AppDataSource.getRepository(Review);
    // Get reviews with pagination
    const [reviews, reviewCount] = await reviewRepository
        .createQueryBuilder('review')
        .select([
            'review',
            'reviewAuthor.id',
            'reviewAuthor.username',
            'reviewMovie.id',
            'reviewMovie.title',
            'reviewMovie.releaseDate',
            'reviewMovie.posterPath',
        ])
        .leftJoin('review.author', 'reviewAuthor')
        .leftJoin('review.movie', 'reviewMovie')
        .where('review.authorId = :userId', { userId: user.id })
        .orderBy('review.createdAt', 'DESC')
        .take(10) // Limit the number of reviews
        .skip(0)
        .getManyAndCount();

    const viewRepository = AppDataSource.getRepository(View);
    // Get views with pagination
    const [views, viewCount] = await viewRepository
        .createQueryBuilder('view')
        .leftJoinAndSelect('view.movie', 'viewMovie')
        .where('view.userId = :userId', { userId: user.id })
        .orderBy('view.viewedAt', 'DESC')
        .take(10) // Limit the number of views
        .skip(0)
        .getManyAndCount();

    // Check if current user follows this user
    let isFollowed = false;
    if (currentUserId) {
        const currentUser = await userRepository.findOne({
            where: { id: currentUserId },
            relations: ['following'],
        });
        isFollowed = currentUser?.following?.some((following) => following.id === user.id) || false;
    }

    return {
        ...user,
        lists: enhancedLists,
        reviews: await addLikeStatsToReviews(reviews, currentUserId),
        views,
        isFollowed,
        counts: {
            lists: listCount,
            reviews: reviewCount,
            views: viewCount,
        },
    };
};

export const deleteUserById = async (userId: number) => {
    try {
        const deleteResult = await userRepository.delete(userId);
        return deleteResult.affected && deleteResult.affected > 0;
    } catch (error) {
        throw new Error(`Error deleting user with ID ${userId}: ${error}`);
    }
};
