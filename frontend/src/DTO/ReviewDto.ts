export default interface ReviewDto {
    id: number;
    review: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
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
