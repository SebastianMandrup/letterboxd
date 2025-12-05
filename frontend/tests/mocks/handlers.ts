import { http, HttpResponse } from 'msw';

// Use wildcard pattern to match any API URL
// Default mock handlers for API endpoints
export const handlers = [
  // Auth endpoints
  http.post('*/auth/login', () => {
    return HttpResponse.json({
      message: 'Logged in successfully',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      },
    });
  }),

  http.post('*/auth/logout', () => {
    return HttpResponse.json({
      message: 'Logged out successfully',
    });
  }),

  http.get('*/auth/me', () => {
    return HttpResponse.json({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    });
  }),

  // Movies endpoints
  http.get('*/movies', () => {
    return HttpResponse.json({
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          title: 'Test Movie 1',
          overview: 'A test movie',
          poster_path: '/test1.jpg',
          release_date: '2024-01-01',
        },
        {
          id: 2,
          title: 'Test Movie 2',
          overview: 'Another test movie',
          poster_path: '/test2.jpg',
          release_date: '2024-02-01',
        },
      ],
    });
  }),

  // Users endpoints
  http.get('*/users', () => {
    return HttpResponse.json({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
        },
      ],
    });
  }),

  // Reviews endpoints
  http.get('*/reviews', () => {
    return HttpResponse.json({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          movie_id: 1,
          user_id: 1,
          rating: 5,
          content: 'Great movie!',
        },
      ],
    });
  }),
];
