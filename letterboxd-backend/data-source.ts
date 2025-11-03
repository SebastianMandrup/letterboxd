import { DataSource } from "typeorm";
import { Comment } from "./entities/Comment";
import { Genre } from './entities/Genre';
import { List } from './entities/List';
import { Movie } from "./entities/Movie";
import { Review } from "./entities/Review";
import { User } from "./entities/User";
import { View } from "./entities/View";


export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as "mysql" | "postgres",
  url: process.env.DB_URL,
  schema: process.env.DB_SCHEMA,
  entities: [Movie, Review, User, View, Comment, Genre, List],
  synchronize: true,
  logging: false,
});
