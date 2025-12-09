import type ReviewDto from '../DTO/ReviewDto';
import ApiClient from './apiClient';

interface LikeReviewResponse {
    status: 'ok' | 'error';
    statusCode: number;
    message: string;
    data?: ReviewDto;
}

class ReviewClient extends ApiClient<ReviewDto> {
    constructor() {
        super('/reviews');
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

export default new ReviewClient();
