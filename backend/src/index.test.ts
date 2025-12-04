import request from 'supertest';
import app from './app.test';
import { DataSource } from 'typeorm';
import { Movie } from './entities/Movie';
import { MovieLike } from './entities/MovieLike';
import { Review } from './entities/Review';
import { ReviewLike } from './entities/ReviewLike';
import { User } from './entities/User';
import { View } from './entities/View';
import { Comment } from './entities/Comment';
import { CommentLike } from './entities/CommentLike';
import { Genre } from './entities/Genre';
import { List } from './entities/List';
import { ListLike } from './entities/ListLike';

let testDataSource: DataSource;

beforeAll(async () => {
  testDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    synchronize: true,
    entities: [
      Movie,
      MovieLike,
      Review,
      ReviewLike,
      User,
      View,
      Comment,
      CommentLike,
      Genre,
      List,
      ListLike,
    ],
  });

  await testDataSource.initialize();

  if (!testDataSource.isInitialized) {
    throw new Error('Failed to initialize test database');
  }

  console.log('Test database initialized');
});

afterAll(async () => {
  if (!testDataSource.isInitialized) return;
  await testDataSource.destroy();
});

describe('GET /', () => {
  it('returns Hello, World!', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello, World!');
  });
});
