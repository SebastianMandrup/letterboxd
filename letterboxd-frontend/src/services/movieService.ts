import ApiClient from './ApiClient';
import type MovieDto from '../DTO/MovieDto';

export default new ApiClient<MovieDto>('/movies');
