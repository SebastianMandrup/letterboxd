import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Movie } from '../entities/Movie';
import { View } from '../entities/View';
import { Review } from '../entities/Review';
import { MovieLike } from '../entities/MovieLike';
import { ReviewLike } from '../entities/ReviewLike';
import { CommentLike } from '../entities/CommentLike';
import { Comment } from '../entities/Comment';
import { Genre } from '../entities/Genre';
import { List } from '../entities/List';
import { ListLike } from '../entities/ListLike';
import { CastMember } from '../entities/CastMember';
import { Country } from '../entities/Country';
import { CrewMember } from '../entities/CrewMember';
import { Language } from '../entities/Language';
import { ProductionCompany } from '../entities/ProductionCompany';
import { Video } from '../entities/Video';

export const TestDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
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
    ],
    synchronize: true,
    logging: false,
});
