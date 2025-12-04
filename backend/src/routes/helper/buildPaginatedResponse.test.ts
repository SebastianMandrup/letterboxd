import buildPaginatedResponse from './buildPaginatedResponse';
import { Request } from 'express';

describe('buildPaginatedResponse', () => {
  let req: Partial<Request>;

  beforeEach(() => {
    req = {
      protocol: 'http',
      baseUrl: '/api/users',
      path: '/',
      get: jest.fn().mockReturnValue('localhost:3000'),
      query: {},
    };
  });

  it('should return correct pagination for default page and pageSize', () => {
    const data = [{ id: 1 }, { id: 2 }];
    const total = 100;

    const result = buildPaginatedResponse(data, total, req as Request);

    expect(result.count).toBe(100);
    expect(result.results).toEqual(data);
    expect(result.next).toBe(
      'http://localhost:3000/api/users/?page=2&pageSize=40',
    );
    expect(result.previous).toBeNull();
  });

  it('should respect query.page and query.pageSize', () => {
    req.query = { page: '2', pageSize: '20' };

    const data = Array.from({ length: 20 }, (_, i) => ({ id: i + 1 }));
    const total = 50;

    const result = buildPaginatedResponse(data, total, req as Request);

    expect(result.next).toBe(
      'http://localhost:3000/api/users/?page=3&pageSize=20',
    );
    expect(result.previous).toBe(
      'http://localhost:3000/api/users/?page=1&pageSize=20',
    );
  });

  it('should cap pageSize to 40 if query.pageSize > 40', () => {
    req.query = { page: '1', pageSize: '100' };

    const data = Array.from({ length: 40 }, (_, i) => ({ id: i + 1 }));
    const total = 100;

    const result = buildPaginatedResponse(data, total, req as Request);

    expect(result.next).toBe(
      'http://localhost:3000/api/users/?page=2&pageSize=40',
    );
  });

  it('should return null for next if on the last page', () => {
    req.query = { page: '3', pageSize: '20' };

    const data = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }));
    const total = 50;

    const result = buildPaginatedResponse(data, total, req as Request);

    expect(result.next).toBeNull();
    expect(result.previous).toBe(
      'http://localhost:3000/api/users/?page=2&pageSize=20',
    );
  });

  it('should return null for previous if on the first page', () => {
    req.query = { page: '1', pageSize: '20' };

    const data = Array.from({ length: 20 }, (_, i) => ({ id: i + 1 }));
    const total = 50;

    const result = buildPaginatedResponse(data, total, req as Request);

    expect(result.previous).toBeNull();
    expect(result.next).toBe(
      'http://localhost:3000/api/users/?page=2&pageSize=20',
    );
  });
});
