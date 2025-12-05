import type UserDto from '../../src/DTO/UserDto';
import type MovieDto from '../../src/DTO/MovieDto';
import type ReviewDto from '../../src/DTO/ReviewDto';
import type ListDto from '../../src/DTO/ListDto';

// Mock User Factory
export const createMockUser = (overrides?: Partial<UserDto>): UserDto => ({
  id: 1,
  username: 'testuser',
  role: 'user',
  email: 'test@example.com',
  numberOfReviews: 0,
  numberOfWatchedFilms: 0,
  reviewLikeCount: 0,
  ...overrides,
});

// Mock Movie Factory
export const createMockMovie = (overrides?: Partial<MovieDto>): MovieDto => ({
  id: 1,
  title: 'Test Movie',
  originalTitle: 'Test Movie',
  adult: false,
  genreIds: [1, 2],
  overview: 'A test movie description',
  popularity: 100,
  posterUrl: '/test-poster.jpg',
  backdropUrl: '/test-backdrop.jpg',
  releaseDate: '2024-01-01',
  voteAverage: 8.5,
  voteCount: 1000,
  likeCount: 50,
  viewCount: 200,
  reviews: [],
  lists: [],
  ...overrides,
});

// Mock Review Factory
export const createMockReview = (overrides?: Partial<ReviewDto>): ReviewDto => ({
  id: 1,
  review: 'Great movie!',
  rating: 5,
  author: {
    id: 1,
    username: 'testuser',
  },
  movie: {
    id: 1,
    title: 'Test Movie',
    posterUrl: '/test-poster.jpg',
    releaseDate: '2024-01-01',
  },
  likeCount: 10,
  ...overrides,
});

// Mock List Factory
export const createMockList = (overrides?: Partial<ListDto>): ListDto => ({
  id: 1,
  name: 'Test List',
  description: 'A test list',
  user_id: 1,
  user: createMockUser(),
  created_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

// Mock paginated response
export const createMockPaginatedResponse = <T>(
  results: T[],
  overrides?: { count?: number; next?: string | null; previous?: string | null }
) => ({
  count: results.length,
  next: null,
  previous: null,
  results,
  ...overrides,
});
