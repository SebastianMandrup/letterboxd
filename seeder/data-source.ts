import { DataSource } from "typeorm";
import { Movie } from './entities/Movie';
import { Review } from './entities/Review';
import { User } from './entities/User';
import { View } from './entities/View';

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3307,
  username: "root",
  password: "123456",
  database: "letterboxd",
  entities: [Movie, Review, User, View], // Registering entities with the data source
  synchronize: true, // Automatically create or modify database schema on every application launch
  logging: true, // Enable query logging for debugging purposes
});
