export default interface CommentDto {
    id: number;
    content: string;
    user: {
        id: number;
        username: string;
    };
    createdAt: string;
}
