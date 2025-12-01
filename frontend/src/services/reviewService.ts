import type ReviewDto from '../DTO/ReviewDto';
import ApiClient from './apiClient';

export default new ApiClient<ReviewDto>('/reviews');
