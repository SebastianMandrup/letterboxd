import type MessageDto from '../DTO/MessageDto';
import type MovieDto from '../DTO/MovieDto';
import ApiClient from './ApiClient';

class MovieClient extends ApiClient<MovieDto> {
    private static instance: MovieClient;

    private constructor() {
        super('/movies');
    }

    public static getInstance(): MovieClient {
        if (!MovieClient.instance) {
            MovieClient.instance = new MovieClient();
        }
        return MovieClient.instance;
    }

    getByTitle = (title: string) => this.axiosInstance.get<MovieDto>(`${this.endpoint}/${encodeURIComponent(title)}`).then((res) => res.data);

    getByPartialSlug = (partialSlug: string) =>
        this.axiosInstance.get<MovieDto[]>(`${this.endpoint}/like/${encodeURIComponent(partialSlug)}`).then((res) => res.data);

    viewMovie = (movieId: number) => this.axiosInstance.post<MessageDto>(`${this.endpoint}/${movieId}/view`).then((res) => res.data);
}

export default MovieClient.getInstance();
