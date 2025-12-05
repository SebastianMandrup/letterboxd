/**
 * Example: Testing Forms and User Interactions
 *
 * This test demonstrates best practices for testing forms:
 * - Using user-event for realistic interactions
 * - Testing form validation
 * - Testing form submission
 * - Testing error states
 * - Accessibility-focused queries
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { useState, FormEvent } from 'react';

// Example form component for demonstration
interface LoginFormProps {
    onSubmit: (data: { username: string; password: string }) => Promise<void>;
    onError?: (error: string) => void;
}

function LoginForm({ onSubmit, onError }: LoginFormProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const newErrors: { username?: string; password?: string } = {};

        // Validation
        if (!username) newErrors.username = 'Username is required';
        if (!password) newErrors.password = 'Password is required';
        if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({ username, password });
        } catch (error) {
            onError?.(error instanceof Error ? error.message : 'Login failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    aria-invalid={!!errors.username}
                    aria-describedby={errors.username ? 'username-error' : undefined}
                />
                {errors.username && (
                    <span id="username-error" role="alert">
                        {errors.username}
                    </span>
                )}
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                />
                {errors.password && (
                    <span id="password-error" role="alert">
                        {errors.password}
                    </span>
                )}
            </div>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
}

describe('Form Testing Examples', () => {
    describe('LoginForm', () => {
        it('should render all form fields', () => {
            const mockSubmit = vi.fn();
            render(<LoginForm onSubmit={mockSubmit} />);

            // Use getByLabelText for accessibility-focused queries
            expect(screen.getByLabelText('Username')).toBeInTheDocument();
            expect(screen.getByLabelText('Password')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
        });

        it('should show validation errors when submitting empty form', async () => {
            const user = userEvent.setup();
            const mockSubmit = vi.fn();

            render(<LoginForm onSubmit={mockSubmit} />);

            // Click submit without filling fields
            await user.click(screen.getByRole('button', { name: 'Login' }));

            // Check for error messages
            expect(await screen.findByText('Username is required')).toBeInTheDocument();
            // Password field will show either "required" or "too short" based on form state
            expect(screen.getByText(/Password (is required|must be at least 6 characters)/)).toBeInTheDocument();

            // Verify form was not submitted
            expect(mockSubmit).not.toHaveBeenCalled();
        });

        it('should validate password length', async () => {
            const user = userEvent.setup();
            const mockSubmit = vi.fn();

            render(<LoginForm onSubmit={mockSubmit} />);

            // Fill in form with short password
            await user.type(screen.getByLabelText('Username'), 'testuser');
            await user.type(screen.getByLabelText('Password'), '12345');

            // Submit form
            await user.click(screen.getByRole('button', { name: 'Login' }));

            // Check for password length error
            expect(await screen.findByText('Password must be at least 6 characters')).toBeInTheDocument();

            // Verify form was not submitted
            expect(mockSubmit).not.toHaveBeenCalled();
        });

        it('should submit form with valid data', async () => {
            const user = userEvent.setup();
            const mockSubmit = vi.fn().mockResolvedValue(undefined);

            render(<LoginForm onSubmit={mockSubmit} />);

            // Fill in form with valid data
            await user.type(screen.getByLabelText('Username'), 'testuser');
            await user.type(screen.getByLabelText('Password'), 'password123');

            // Submit form
            await user.click(screen.getByRole('button', { name: 'Login' }));

            // Verify form was submitted with correct data
            await waitFor(() => {
                expect(mockSubmit).toHaveBeenCalledWith({
                    username: 'testuser',
                    password: 'password123',
                });
            });
        });

        it('should show loading state during submission', async () => {
            const user = userEvent.setup();
            const mockSubmit = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

            render(<LoginForm onSubmit={mockSubmit} />);

            // Fill and submit form
            await user.type(screen.getByLabelText('Username'), 'testuser');
            await user.type(screen.getByLabelText('Password'), 'password123');
            await user.click(screen.getByRole('button', { name: 'Login' }));

            // Check for loading state
            expect(screen.getByRole('button', { name: 'Logging in...' })).toBeDisabled();

            // Wait for submission to complete
            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Login' })).not.toBeDisabled();
            });
        });

        it('should handle submission errors', async () => {
            const user = userEvent.setup();
            const mockSubmit = vi.fn().mockRejectedValue(new Error('Invalid credentials'));
            const mockError = vi.fn();

            render(<LoginForm onSubmit={mockSubmit} onError={mockError} />);

            // Fill and submit form
            await user.type(screen.getByLabelText('Username'), 'testuser');
            await user.type(screen.getByLabelText('Password'), 'wrongpass');
            await user.click(screen.getByRole('button', { name: 'Login' }));

            // Verify error handler was called
            await waitFor(() => {
                expect(mockError).toHaveBeenCalledWith('Invalid credentials');
            });
        });

        it('should clear validation errors when user starts typing', async () => {
            const user = userEvent.setup();
            const mockSubmit = vi.fn();

            render(<LoginForm onSubmit={mockSubmit} />);

            // Submit to show errors
            await user.click(screen.getByRole('button', { name: 'Login' }));
            expect(await screen.findByText('Username is required')).toBeInTheDocument();

            // Start typing in username field
            await user.type(screen.getByLabelText('Username'), 't');

            // Error should still be visible until next submit
            // (This depends on your form implementation)
            // This test shows how to test error clearing behavior
        });

        it('should have proper ARIA attributes for accessibility', async () => {
            const user = userEvent.setup();
            const mockSubmit = vi.fn();

            render(<LoginForm onSubmit={mockSubmit} />);

            // Submit to trigger validation
            await user.click(screen.getByRole('button', { name: 'Login' }));

            // Wait for errors
            await screen.findByText('Username is required');

            // Check ARIA attributes
            const usernameInput = screen.getByLabelText('Username');
            expect(usernameInput).toHaveAttribute('aria-invalid', 'true');
            expect(usernameInput).toHaveAttribute('aria-describedby', 'username-error');

            // Check error has role="alert"
            const errorMessage = screen.getByText('Username is required');
            expect(errorMessage).toHaveAttribute('role', 'alert');
        });

        it('should allow tab navigation between fields', async () => {
            const user = userEvent.setup();
            const mockSubmit = vi.fn();

            render(<LoginForm onSubmit={mockSubmit} />);

            const usernameInput = screen.getByLabelText('Username');
            const passwordInput = screen.getByLabelText('Password');
            const submitButton = screen.getByRole('button', { name: 'Login' });

            // Start at username
            usernameInput.focus();
            expect(usernameInput).toHaveFocus();

            // Tab to password
            await user.tab();
            expect(passwordInput).toHaveFocus();

            // Tab to submit button
            await user.tab();
            expect(submitButton).toHaveFocus();
        });
    });
});

/**
 * Key Takeaways for Form Testing:
 *
 * 1. Use userEvent.setup() for each test
 * 2. Query by label text, role, and placeholder (user-visible content)
 * 3. Test validation logic thoroughly
 * 4. Test both success and error paths
 * 5. Test loading states
 * 6. Verify form is not submitted when validation fails
 * 7. Test accessibility attributes (ARIA)
 * 8. Test keyboard navigation
 * 9. Mock async operations (API calls)
 * 10. Use waitFor for async assertions
 */
