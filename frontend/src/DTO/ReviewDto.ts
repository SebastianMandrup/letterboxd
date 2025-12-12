export default interface ReviewDto {
    id: number;
    review: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    author: {
        id: number;
        username: string;
    };
    movie: {
        id: number;
        title: string;
        posterPath: string;
        releaseDate: string;
    };
    likeCount: number;
    isLiked: boolean;
}
