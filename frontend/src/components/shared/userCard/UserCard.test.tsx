import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserCard from './UserCard';
import type UserDto from '../../../DTO/UserDto';

describe('UserCard', () => {
    const mockUser: UserDto = {
        id: 1,
        username: 'testuser',
        role: 'user',
        numberOfWatchedFilms: 42,
        numberOfReviews: 15,
    };

    it('renders user information correctly', () => {
        render(<UserCard user={mockUser} />);

        const username = screen.getByText('testuser');
        expect(username).toBeInTheDocument();
        expect(username).toHaveAttribute('href', '/users/testuser');
    });

    it('displays film count', () => {
        render(<UserCard user={mockUser} />);

        const filmsText = screen.getByText('42 films');
        expect(filmsText).toBeInTheDocument();
    });

    it('displays review count', () => {
        render(<UserCard user={mockUser} />);

        const reviewsText = screen.getByText('15 reviews');
        expect(reviewsText).toBeInTheDocument();
    });

    it('renders avatar image with correct src', () => {
        render(<UserCard user={mockUser} />);

        const avatar = screen.getByRole('img');
        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveAttribute('alt', 'testuser');
        // Avatar src includes username
        expect(avatar.getAttribute('src')).toContain('testuser');
    });

    it('renders follow button', () => {
        render(<UserCard user={mockUser} />);

        const followButton = screen.getByTitle('Follow user');
        expect(followButton).toBeInTheDocument();
        expect(followButton.tagName).toBe('BUTTON');
    });

    it('handles zero films and reviews', () => {
        const userWithZeroStats: UserDto = {
            ...mockUser,
            numberOfWatchedFilms: 0,
            numberOfReviews: 0,
        };

        render(<UserCard user={userWithZeroStats} />);

        expect(screen.getByText('0 films')).toBeInTheDocument();
        expect(screen.getByText('0 reviews')).toBeInTheDocument();
    });

    it('handles large numbers', () => {
        const userWithManyStats: UserDto = {
            ...mockUser,
            numberOfWatchedFilms: 9999,
            numberOfReviews: 1234,
        };

        render(<UserCard user={userWithManyStats} />);

        expect(screen.getByText('9999 films')).toBeInTheDocument();
        expect(screen.getByText('1234 reviews')).toBeInTheDocument();
    });
});
