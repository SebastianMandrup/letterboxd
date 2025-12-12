import type ReviewDto from '../DTO/ReviewDto';
import ApiClient from './ApiClient';

interface LikeReviewResponse {
    status: 'ok' | 'error';
    statusCode: number;
    message: string;
    data?: ReviewDto;
}

class ReviewClient extends ApiClient<ReviewDto> {
    private static instance: ReviewClient;

    private constructor() {
        super('/reviews');
    }

    public static getInstance(): ReviewClient {
        if (!ReviewClient.instance) {
            ReviewClient.instance = new ReviewClient();
        }
        return ReviewClient.instance;
    }

    likeReview = (reviewId: number) => {
        return this.axiosInstance.post<LikeReviewResponse>(`${this.endpoint}/${reviewId}/like`).then((res) => {
            return {
                ...res.data,
                statusCode: res.status,
            };
        });
    };
}

export default ReviewClient.getInstance();
