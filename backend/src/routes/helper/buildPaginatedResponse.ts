import { Request } from 'express';
import PaginatedResponse from '../../DTO/PaginatedResponse';

export default <T>(
  data: T[],
  total: number,
  req: Request,
): PaginatedResponse<T> => {
  const page = req.query.page ? Number(req.query.page) : 1;
  let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 40;

  if (pageSize > 40) pageSize = 40;

  const totalPages = Math.ceil(total / pageSize);

  const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

  const buildPageLink = (pageNum: number) =>
    `${baseUrl}?page=${pageNum}&pageSize=${pageSize}`;

  return {
    count: total,
    next: page < totalPages ? buildPageLink(page + 1) : null,
    previous: page > 1 ? buildPageLink(page - 1) : null,
    results: data,
  };
};
