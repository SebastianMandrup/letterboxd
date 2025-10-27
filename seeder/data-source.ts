import { DataSource } from "typeorm";
import { Movie } from './entities/Movie';
import { Review } from './entities/Review';
import { User } from './entities/User';
import { View } from './entities/View';

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as "mysql" | "postgres",
  url: process.env.DB_URL,
  entities: [Movie, Review, User, View], // Registering entities with the data source
  synchronize: true, // Automatically create or modify database schema on every application launch
  logging: false, // Enable query logging for debugging purposes
});
