import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../../tests/utils/test-utils';
import ReviewCard from './ReviewCard';
import { createMockReview } from '../../../../tests/mocks/mockData';

describe('ReviewCard', () => {
  it('should render review with movie poster', () => {
    const mockReview = createMockReview({
      movie: {
        id: 1,
        title: 'Test Movie',
        posterUrl: '/test-poster.jpg',
        releaseDate: '2024-01-01',
      },
    });

    render(<ReviewCard review={mockReview} />);

    const image = screen.getByRole('img', { name: 'Test Movie' });
    expect(image).toBeInTheDocument();
  });

  it('should truncate long reviews to 200 characters', () => {
    const longReview = 'A'.repeat(250);
    const mockReview = createMockReview({
      review: longReview,
    });

    render(<ReviewCard review={mockReview} />);

    const reviewText = screen.getByText(/A{200}\.\.\./);
    expect(reviewText).toBeInTheDocument();
    expect(reviewText.textContent).toHaveLength(203); // 200 + '...'
  });

  it('should not truncate short reviews', () => {
    const shortReview = 'This is a short review';
    const mockReview = createMockReview({
      review: shortReview,
    });

    render(<ReviewCard review={mockReview} />);

    const reviewText = screen.getByText(shortReview);
    expect(reviewText).toBeInTheDocument();
    expect(reviewText.textContent).toBe(shortReview);
  });

  it('should render review with all required elements', () => {
    const mockReview = createMockReview();

    render(<ReviewCard review={mockReview} />);

    // Check for review content
    expect(screen.getByText('Great movie!')).toBeInTheDocument();
  });
});
