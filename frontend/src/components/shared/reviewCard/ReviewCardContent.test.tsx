import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '../../../../tests/utils/test-utils';
import ReviewCardContent from './ReviewCardContent';
import { createMockReview } from '../../../../tests/mocks/mockData';
import { useUserStore } from '../../../stores/useUserStore';

describe('ReviewCardContent', () => {
  beforeEach(() => {
    // Reset user store before each test
    useUserStore.setState({ user: null });
  });

  it('should render movie title with link', () => {
    const mockReview = createMockReview({
      movie: {
        id: 1,
        title: 'Test Movie',
        posterUrl: '/poster.jpg',
        releaseDate: '2024-01-01',
      },
    });

    render(<ReviewCardContent review={mockReview} />);

    const movieLink = screen.getByRole('link', { name: 'Test Movie' });
    expect(movieLink).toBeInTheDocument();
    expect(movieLink).toHaveAttribute('href', '/movie/test-movie');
  });

  it('should render release year', () => {
    const mockReview = createMockReview({
      movie: {
        id: 1,
        title: 'Test Movie',
        posterUrl: '/poster.jpg',
        releaseDate: '2024-06-15',
      },
    });

    render(<ReviewCardContent review={mockReview} />);

    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('should render author information', () => {
    const mockReview = createMockReview({
      author: {
        id: 1,
        username: 'testuser',
      },
    });

    render(<ReviewCardContent review={mockReview} />);

    const authorLink = screen.getByRole('link', { name: 'testuser' });
    expect(authorLink).toBeInTheDocument();
    expect(authorLink).toHaveAttribute('href', '/user/testuser');

    const avatar = screen.getByRole('img', { name: "testuser's avatar" });
    expect(avatar).toBeInTheDocument();
  });

  it('should render star rating', () => {
    const mockReview = createMockReview({
      rating: 5,
    });

    render(<ReviewCardContent review={mockReview} />);

    const stars = screen.getAllByText('★');
    expect(stars).toHaveLength(5);
  });

  it('should render correct number of stars for rating', () => {
    const mockReview = createMockReview({
      rating: 3,
    });

    render(<ReviewCardContent review={mockReview} />);

    const stars = screen.getAllByText('★');
    expect(stars).toHaveLength(3);
  });

  it('should render review text', () => {
    const mockReview = createMockReview({
      review: 'This is an amazing movie!',
    });

    render(<ReviewCardContent review={mockReview} />);

    expect(screen.getByText('This is an amazing movie!')).toBeInTheDocument();
  });

  it('should render like count', () => {
    const mockReview = createMockReview({
      likeCount: 42,
    });

    render(<ReviewCardContent review={mockReview} />);

    expect(screen.getByText('42 likes')).toBeInTheDocument();
  });

  it('should show like button when user is authenticated', () => {
    // Set authenticated user
    useUserStore.setState({
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        numberOfReviews: 0,
        numberOfWatchedFilms: 0,
        reviewLikeCount: 0,
      },
    });

    const mockReview = createMockReview();

    render(<ReviewCardContent review={mockReview} />);

    const likeButton = screen.getByRole('button', { name: /like review/i });
    expect(likeButton).toBeInTheDocument();
  });

  it('should not show like button when user is not authenticated', () => {
    const mockReview = createMockReview();

    render(<ReviewCardContent review={mockReview} />);

    const likeButton = screen.queryByRole('button', { name: /like review/i });
    expect(likeButton).not.toBeInTheDocument();
  });

  it('should handle half star ratings by rounding', () => {
    const mockReview = createMockReview({
      rating: 3.6,
    });

    render(<ReviewCardContent review={mockReview} />);

    const stars = screen.getAllByText('★');
    expect(stars).toHaveLength(4); // 3.6 rounds to 4
  });
});
