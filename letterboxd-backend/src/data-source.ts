import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Comment } from "./entities/Comment";
import { CommentLike } from './entities/CommentLike';
import { Genre } from './entities/Genre';
import { List } from './entities/List';
import { ListLike } from './entities/ListLike';
import { Movie } from "./entities/Movie";
import { MovieLike } from './entities/MovieLike';
import { Review } from "./entities/Review";
import { ReviewLike } from './entities/ReviewLike';
import { User } from "./entities/User";
import { View } from "./entities/View";

dotenv.config();

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as "mysql" | "postgres",
  url: process.env.DB_URL,
  schema: process.env.DB_SCHEMA,
  entities: [Movie, MovieLike, Review, ReviewLike, User, View, Comment, CommentLike, Genre, List, ListLike],
  synchronize: true,
  logging: false,
});
