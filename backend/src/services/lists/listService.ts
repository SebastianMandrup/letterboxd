import { SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { List } from '../../entities/List';
import { Request } from 'express';

const listRepository = AppDataSource.getRepository(List);

const START_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 40;
const FEATURE_MOVIE_IDS = [27, 44, 14, 17];

const addFeaturedFilter = (
  queryBuilder: SelectQueryBuilder<List>,
  featured?: boolean,
) => {
  if (featured) {
    queryBuilder.andWhere('list.id IN (:...ids)', {
      ids: FEATURE_MOVIE_IDS,
    });
  }
};

const addSorting = (qb: SelectQueryBuilder<List>, sortBy?: string) => {
  if (sortBy === 'popularity') {
    qb.addSelect((subQuery) => {
      return subQuery
        .select('COUNT(*)')
        .from('list_likes', 'like')
        .where('like.listId = list.id');
    }, 'likeCount').orderBy('likeCount', 'DESC');
  }
  return qb;
};

const getMoviesQueryBuilder = async (req: Request) => {
  const queryBuilder = listRepository.createQueryBuilder('list');
  const featured = req.query.featured === 'true';
  const sortBy = req.query.sortBy as string | undefined;

  addFeaturedFilter(queryBuilder, featured);
  addSorting(queryBuilder, sortBy);

  queryBuilder
    .leftJoinAndSelect('list.user', 'user')
    .leftJoinAndSelect('list.movies', 'movie');

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

    // Use getRawAndEntities to map the subquery column into each entity
    const { entities: lists, raw } = await queryBuilder.getRawAndEntities();

    // Map likeCount into each list
    lists.forEach((list, index) => {
      list['likeCount'] = Number(raw[index]['likeCount']) || 0;
    });

    // Get total count (without pagination)
    const total = await queryBuilder.getCount();

    return { lists, total };
  } catch (error) {
    console.error('Error fetching lists:', error);
    return { lists: [], total: 0 };
  }
};
