import dotenv from 'dotenv';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Comment } from './entities/Comment.ts';
import { CommentLike } from './entities/CommentLike.ts';
import { Genre } from './entities/Genre.ts';
import { List } from './entities/List.ts';
import { ListLike } from './entities/ListLike.ts';
import { Movie } from './entities/Movie.ts';
import { MovieLike } from './entities/MovieLike.ts';
import { Review } from './entities/Review.ts';
import { ReviewLike } from './entities/ReviewLike.ts';
import { User } from './entities/User.ts';
import { View } from './entities/View.ts';
import { CastMember } from './entities/CastMember.ts';
import { Country } from './entities/Country.ts';
import { CrewMember } from './entities/CrewMember.ts';
import { Language } from './entities/Language.ts';
import { ProductionCompany } from './entities/ProductionCompany.ts';
import { Video } from './entities/Video.ts';

dotenv.config();

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as 'mysql' | 'postgres',
    url: process.env.DB_URL,
    schema: process.env.DB_SCHEMA,
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
        CastMember,
        Country,
        CrewMember,
        Language,
        ProductionCompany,
        Video,
    ], // Registering entities with the data source
    synchronize: true, // Automatically create or modify database schema on every application launch
    logging: false, // Enable query logging for debugging purposes
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});
