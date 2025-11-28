export default interface ReviewDto {
  id: number;
  review: string;
  rating: number;
  author: {
    name: string;
  };
}
