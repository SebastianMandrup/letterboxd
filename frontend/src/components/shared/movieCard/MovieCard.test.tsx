import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../../tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import MovieCard from './MovieCard';

describe('MovieCard', () => {
  const mockProps = {
    title: 'Test Movie',
    src: '/test-poster.jpg',
    alt: 'Test Movie Poster',
  };

  it('should render movie card with image', () => {
    render(<MovieCard {...mockProps} />);
    
    const image = screen.getByRole('img', { name: mockProps.alt });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProps.src);
    expect(image).toHaveAttribute('alt', mockProps.alt);
  });

  it('should render overlay when provided', () => {
    const overlay = <div data-testid="test-overlay">Overlay Content</div>;
    render(<MovieCard {...mockProps} overlay={overlay} />);
    
    expect(screen.getByTestId('test-overlay')).toBeInTheDocument();
    expect(screen.getByText('Overlay Content')).toBeInTheDocument();
  });

  it('should not render overlay when not provided', () => {
    render(<MovieCard {...mockProps} />);
    
    expect(screen.queryByTestId('test-overlay')).not.toBeInTheDocument();
  });

  it('should navigate to movie page on click', async () => {
    const user = userEvent.setup();
    
    // Mock location.href
    delete (window as any).location;
    window.location = { href: '' } as any;
    
    render(<MovieCard {...mockProps} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    // Check that location.href was set to the slugified movie URL
    expect(window.location.href).toBe('/movie/test-movie');
  });

  it('should create correct slug from title with special characters', async () => {
    const user = userEvent.setup();
    
    delete (window as any).location;
    window.location = { href: '' } as any;
    
    render(
      <MovieCard
        title="The Movie: A Special Edition!"
        src="/test.jpg"
        alt="Test"
      />
    );
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(window.location.href).toBe('/movie/the-movie-a-special-edition');
  });

  it('should render as a button element', () => {
    render(<MovieCard {...mockProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
