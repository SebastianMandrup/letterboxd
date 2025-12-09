import type MovieDto from '../DTO/MovieDto';
import ApiClient from './apiClient';

interface ViewMovieResponse {
    message: string;
}

export class MovieClient extends ApiClient<MovieDto> {
    constructor() {
        super('/movies');
    }

    getByTitle = (title: string) => this.axiosInstance.get<MovieDto>(`${this.endpoint}/${encodeURIComponent(title)}`).then((res) => res.data);

    getByPartialSlug = (partialSlug: string) =>
        this.axiosInstance.get<MovieDto[]>(`${this.endpoint}/like/${encodeURIComponent(partialSlug)}`).then((res) => res.data);

    viewMovie = (movieId: number) => this.axiosInstance.post<ViewMovieResponse>(`${this.endpoint}/${movieId}/view`).then((res) => res.data);
}
