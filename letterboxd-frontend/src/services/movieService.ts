import ApiClient from './apiClient';
import type MovieDto from '../DTO/MovieDto';

export default new ApiClient<MovieDto>('/movies');
