export default interface UserDto {
    id: number;
    username: string;
    role: string;
    email: string;

    numberOfReviews: number;
    numberOfWatchedFilms: number;
    reviewLikeCount: number;
}
