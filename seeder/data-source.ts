import dotenv from 'dotenv';
import 'dotenv/config';
import { DataSource } from "typeorm";
import { Comment } from './entities/Comment';
import { Genre } from './entities/Genre';
import { List } from './entities/List';
import { Movie } from './entities/Movie';
import { Review } from './entities/Review';
import { User } from './entities/User';
import { View } from './entities/View';

dotenv.config();

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as "mysql" | "postgres",
  url: process.env.DB_URL,
  schema: process.env.DB_SCHEMA,
  entities: [Movie, Review, User, View, Comment, Genre, List], // Registering entities with the data source
  synchronize: true, // Automatically create or modify database schema on every application launch
  logging: false, // Enable query logging for debugging purposes
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});
