import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StarIcon from './StarIcon';

describe('StarIcon Component', () => {
    it('should render the icon', () => {
        render(<StarIcon size={24} />);
        const icon = screen.getByRole('img', { name: 'Star' });
        expect(icon).toBeInTheDocument();
    });

    it('should apply the correct size', () => {
        const { container } = render(<StarIcon size={32} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('width', '32');
        expect(svg).toHaveAttribute('height', '32');
    });

    it('should use default color when not specified', () => {
        const { container } = render(<StarIcon size={24} />);
        const path = container.querySelector('path');
        expect(path).toHaveAttribute('fill', 'currentColor');
    });

    it('should apply custom color when specified', () => {
        const { container } = render(<StarIcon size={24} color="#FFD700" />);
        const path = container.querySelector('path');
        expect(path).toHaveAttribute('fill', '#FFD700');
    });

    it('should have correct viewBox', () => {
        const { container } = render(<StarIcon size={24} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('should render with different sizes', () => {
        const { container: container1 } = render(<StarIcon size={16} />);
        const svg1 = container1.querySelector('svg');
        expect(svg1).toHaveAttribute('width', '16');
        expect(svg1).toHaveAttribute('height', '16');

        const { container: container2 } = render(<StarIcon size={48} />);
        const svg2 = container2.querySelector('svg');
        expect(svg2).toHaveAttribute('width', '48');
        expect(svg2).toHaveAttribute('height', '48');
    });
});
