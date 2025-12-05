# Frontend Test Coverage

This document describes the test coverage for the React frontend application.

## Test Structure

Tests are organized into several categories:

### Unit Tests
- **Location**: Co-located with source files (e.g., `getSlug.test.ts` next to `getSlug.ts`)
- **Purpose**: Test pure functions and utilities in isolation
- **Examples**: URL slug generation, image URL transformation, avatar generation

### Component Tests
- **Location**: Co-located with components (e.g., `MovieCard.test.tsx` next to `MovieCard.tsx`)
- **Purpose**: Test React components with proper DOM rendering
- **Examples**: MovieCard, UserCard

### Store Tests
- **Location**: `src/stores/*.test.ts`
- **Purpose**: Test Zustand state management stores
- **Examples**: useUserStore, useToastStore

### Hook Tests
- **Location**: `src/hooks/*.test.ts`
- **Purpose**: Test custom React hooks
- **Examples**: useAuth

### Integration Tests
- **Location**: `tests/integration/`
- **Purpose**: Test real API interactions with backend
- **Examples**: user-auth.test.ts (user registration and login with real API)

## Test Statistics

**Total**: 53 tests across 9 test files

### By Category

#### Utility Functions (18 tests)
- `getSlug.test.ts` - 10 tests
- `getThumbnailPoster.test.ts` - 4 tests
- `getMediumPoster.test.ts` - 3 tests
- `getApiAvatar.test.ts` - 3 tests

#### Zustand Stores (16 tests)
- `useUserStore.test.ts` - 6 tests
- `useToastStore.test.ts` - 10 tests

#### React Components (14 tests)
- `MovieCard.test.tsx` - 7 tests
- `UserCard.test.tsx` - 7 tests

#### Custom Hooks (4 tests)
- `useAuth.test.ts` - 4 tests

## Running Tests

```bash
# Run all unit tests (excludes integration tests)
npm test

# Run integration tests only (requires backend running)
npm run test:integration

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Test Infrastructure

### Dependencies
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom DOM matchers
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - DOM environment for tests
- `vitest` - Fast unit test framework

### Configuration Files
- `vitest.setup.ts` - Global test setup and cleanup
- `vite.config.ts` - Test configuration with jsdom environment
- `vitest.integration.config.ts` - Integration test configuration
- `test-utils.tsx` - Reusable test utilities with providers

## Test Patterns

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import MovieCard from './MovieCard';

it('renders movie card', () => {
    render(<MovieCard title="Inception" src="/poster.jpg" alt="Poster" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
});
```

### Store Testing
```typescript
import { useUserStore } from './useUserStore';

it('sets user correctly', () => {
    const mockUser = { id: 1, username: 'test', role: 'user' };
    useUserStore.getState().setUser(mockUser);
    expect(useUserStore.getState().user).toEqual(mockUser);
});
```

### Hook Testing
```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';

it('reflects user from store', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
});
```

## Coverage Goals

Current coverage focuses on:
- ✅ Core utility functions
- ✅ State management stores
- ✅ Reusable UI components
- ✅ Authentication hooks
- ✅ API integration tests

Future coverage should include:
- Page components (Index, Movies, MoviePage, etc.)
- Additional custom hooks (useMovies, useReviews, etc.)
- More complex components (Header, SignUpModal, etc.)
- E2E tests with Playwright/Cypress

## Best Practices

1. **Co-locate tests** with source files for easy discovery
2. **Use descriptive test names** that explain what is being tested
3. **Test behavior, not implementation** to make tests more resilient
4. **Clean up after tests** using `afterEach(cleanup)`
5. **Mock external dependencies** when testing in isolation
6. **Use real providers** for component tests (React Query, Router)
7. **Test edge cases** and boundary conditions
8. **Keep tests simple** and focused on one thing

## Continuous Integration

Tests run automatically on:
- Push to any branch
- Pull request creation
- Pull request updates

All tests must pass before code can be merged.
