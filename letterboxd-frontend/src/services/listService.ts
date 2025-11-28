import ApiClient from './ApiClient';
import type ListDto from '../DTO/ListDto';

export default new ApiClient<ListDto>('/lists');