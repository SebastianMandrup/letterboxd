import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from './MovieCard';

describe('MovieCard', () => {
    const mockProps = {
        title: 'Inception',
        src: 'https://example.com/poster.jpg',
        alt: 'Inception poster',
    };

    beforeEach(() => {
        // Mock location.href
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (window as any).location;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.location = { href: '' } as any;
    });

    it('renders the movie card with image', () => {
        render(<MovieCard {...mockProps} />);

        const img = screen.getByRole('img');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', mockProps.src);
        expect(img).toHaveAttribute('alt', mockProps.alt);
    });

    it('renders without overlay by default', () => {
        const { container } = render(<MovieCard {...mockProps} />);

        const button = container.querySelector('button');
        expect(button?.children.length).toBe(1); // Only img, no overlay
    });

    it('renders with overlay when provided', () => {
        const overlay = <div data-testid="test-overlay">Rating: 5/5</div>;
        render(<MovieCard {...mockProps} overlay={overlay} />);

        const overlayElement = screen.getByTestId('test-overlay');
        expect(overlayElement).toBeInTheDocument();
        expect(overlayElement).toHaveTextContent('Rating: 5/5');
    });

    it('navigates to movie page when clicked', () => {
        render(<MovieCard {...mockProps} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(window.location.href).toBe('/movie/inception');
    });

    it('creates correct slug from title with spaces', () => {
        render(<MovieCard {...mockProps} title="The Dark Knight" src={mockProps.src} alt={mockProps.alt} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(window.location.href).toBe('/movie/the-dark-knight');
    });

    it('creates correct slug from title with special characters', () => {
        render(<MovieCard {...mockProps} title="Schindler's List" src={mockProps.src} alt={mockProps.alt} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(window.location.href).toBe('/movie/schindlers-list');
    });

    it('has correct button styling class', () => {
        const { container } = render(<MovieCard {...mockProps} />);

        const button = container.querySelector('button');
        expect(button?.className).toContain('articleMovie');
    });
});
