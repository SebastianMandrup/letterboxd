import ApiClient from './apiClient';
import type ListDto from '../DTO/ListDto';

export default new ApiClient<ListDto>('/lists');