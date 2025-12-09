export default interface ReviewDto {
    id: number;
    review: string;
    rating: number;
    author: {
        id: number;
        username: string;
    };
    movie: {
        id: number;
        title: string;
        posterUrl: string;
        releaseDate: string;
    };
    likeCount: number;
    isLiked: boolean;
}
