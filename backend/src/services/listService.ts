import { SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '../startup/data-source';
import { List } from '../entities/List';
import { Request } from 'express';

const listRepository = AppDataSource.getRepository(List);

const START_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 40;
const FEATURE_LIST_IDS = [27, 44, 14, 17];
const CREW_PICK_LIST_IDS = [5, 23, 30, 39, 41, 48];

const addFilter = (queryBuilder: SelectQueryBuilder<List>, filter?: string | undefined) => {
    if (filter === 'featured') {
        queryBuilder.andWhere('list.id IN (:...ids)', {
            ids: FEATURE_LIST_IDS,
        });
    } else if (filter === 'crewPicks') {
        queryBuilder.andWhere('list.id IN (:...ids)', {
            ids: CREW_PICK_LIST_IDS,
        });
    }
};

const addSorting = (qb: SelectQueryBuilder<List>, sortBy?: string) => {
    if (sortBy === 'popularity') {
        qb.addSelect((subQuery) => {
            return subQuery.select('COUNT(*)').from('list_likes', 'like').where('like.listId = list.id');
        }, 'likeCount').orderBy('likeCount', 'DESC');
    } else if (sortBy === 'recentlyLiked') {
        qb.addSelect((subQuery) => {
            return subQuery.select('MAX(like.createdAt)').from('list_likes', 'like').where('like.listId = list.id');
        }, 'recentLikeDate').orderBy('recentLikeDate', 'DESC');
    }
    return qb;
};

const getMoviesQueryBuilder = async (req: Request) => {
    const queryBuilder = listRepository.createQueryBuilder('list');
    const filterBy = req.query.filterBy as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;

    addFilter(queryBuilder, filterBy);
    addSorting(queryBuilder, sortBy);

    queryBuilder
        .leftJoin('list.user', 'user')
        .addSelect(['user.id', 'user.username'])
        .leftJoinAndSelect('list.movies', 'movie')
        .loadRelationCountAndMap('list.likeCount', 'list.likes')
        .loadRelationCountAndMap('list.commentCount', 'list.comments');

    return queryBuilder;
};

export const getLists = async (req: Request) => {
    const page = req.query.page ? Number(req.query.page) : START_PAGE;
    let pageSize = req.query.pageSize ? Number(req.query.pageSize) : DEFAULT_PAGE_SIZE;

    if (pageSize > MAX_PAGE_SIZE) pageSize = MAX_PAGE_SIZE;

    const queryBuilder = await getMoviesQueryBuilder(req);

    try {
        queryBuilder.skip((page - 1) * pageSize).take(pageSize);

        const [lists, total] = await queryBuilder.getManyAndCount();

        return { lists, total };
    } catch (error) {
        console.error('Error fetching lists:', error);
        return { lists: [], total: 0 };
    }
};
