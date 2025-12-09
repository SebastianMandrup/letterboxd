export default interface ApiResponse<T> {
    message?: string;
    error?: string;
    data?: T;
}
