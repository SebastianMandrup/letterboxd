import { SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { List } from '../../entities/List';
import { Request } from 'express';

const listRepository = AppDataSource.getRepository(List);

const START_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 40;

const addFeaturedFilter = (
  queryBuilder: SelectQueryBuilder<List>,
  featured?: boolean,
) => {
  if (featured) {
    queryBuilder.andWhere('list.id IN (:...ids)', {
      ids: [27, 44, 14, 17],
    });

    queryBuilder
      .leftJoinAndSelect('list.movies', 'movie')
      .leftJoin('list.user', 'user')
      .addSelect(['user.username']);
  }
};

const addSorting = (qb: SelectQueryBuilder<List>, sortBy?: string) => {
  if (sortBy === 'popularity') {
    qb.leftJoinAndSelect('list.movies', 'movie')
      .leftJoin('list.user', 'user')
      .addSelect(['user.username'])
      .leftJoin('list.likes', 'like')
      .addSelect('COUNT(like.id)', 'likeCount')
      .groupBy('list.id')
      .addGroupBy('user.id')
      .orderBy('likeCount', 'DESC');
    return qb;
  }
  return qb;
};

const getMoviesQueryBuilder = async (req: Request) => {
  const queryBuilder = listRepository.createQueryBuilder('list');
  const featured = req.query.featured === 'true';
  const sortBy = req.query.sortBy as string | undefined;

  addFeaturedFilter(queryBuilder, featured);
  addSorting(queryBuilder, sortBy);

  return queryBuilder;
};

export const getLists = async (req: Request) => {
  const page = req.query.page ? Number(req.query.page) : START_PAGE;
  let pageSize = req.query.pageSize
    ? Number(req.query.pageSize)
    : DEFAULT_PAGE_SIZE;

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
