import type MovieDto from '../DTO/MovieDto';
import ApiClient from './apiClient';

export class MovieClient extends ApiClient<MovieDto> {
  constructor() {
    super('/movies');
  }

  getByTitle = (title: string) =>
    this.axiosInstance
      .get<MovieDto>(`${this.endpoint}/${encodeURIComponent(title)}`)
      .then((res) => res.data);
}
