import { http, HttpResponse } from 'msw';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Default mock handlers for API endpoints
export const handlers = [
  // Auth endpoints
  http.post(`${API_URL}/auth/login`, () => {
    return HttpResponse.json({
      message: 'Logged in successfully',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      },
    });
  }),

  http.post(`${API_URL}/auth/logout`, () => {
    return HttpResponse.json({
      message: 'Logged out successfully',
    });
  }),

  http.get(`${API_URL}/auth/me`, () => {
    return HttpResponse.json({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    });
  }),

  // Movies endpoints
  http.get(`${API_URL}/movies`, () => {
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
  http.get(`${API_URL}/users`, () => {
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
  http.get(`${API_URL}/reviews`, () => {
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
