import { List } from '../entities/List';
import { Review } from '../entities/Review';
import { View } from '../entities/View';

export interface PopulatedUserDto {
    id: number;
    username: string;
    role: string;
    lists: List[];
    reviews: Review[];
    views: View[];
}
