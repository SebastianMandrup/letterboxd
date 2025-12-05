# Testing Guide for Letterboxd Frontend

This document provides comprehensive guidance on testing the Letterboxd React frontend application.

## Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Overview

The frontend uses a comprehensive testing strategy covering:
- **Unit Tests**: Testing individual functions, utilities, and hooks
- **Component Tests**: Testing React components in isolation
- **Integration Tests**: Testing complete user flows and API interactions

## Testing Stack

### Core Testing Libraries

- **[Vitest](https://vitest.dev/)**: Fast unit test framework with native ESM support
- **[React Testing Library](https://testing-library.com/react)**: Testing React components with user-centric queries
- **[@testing-library/user-event](https://testing-library.com/docs/user-event/intro)**: Simulating user interactions
- **[@testing-library/jest-dom](https://github.com/testing-library/jest-dom)**: Custom matchers for DOM assertions
- **[MSW (Mock Service Worker)](https://mswjs.io/)**: API mocking for integration tests
- **[jsdom](https://github.com/jsdom/jsdom)**: DOM implementation for Node.js

### Test Environment

- **Environment**: jsdom (simulates browser environment)
- **Globals**: Vitest globals enabled (describe, it, expect available without imports)
- **Setup File**: `tests/setup.ts` - Configures test environment and MSW

## Running Tests

### Available Commands

```bash
# Run all unit tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with UI dashboard
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run integration tests only
npm run test:integration

# Run all tests (unit + integration)
npm run test:all
```

### Test Execution

- Unit tests run in **jsdom** environment (simulates browser)
- Integration tests run in **node** environment (tests API calls)
- Tests exclude the `tests/integration/**` directory by default

## Test Structure

### Directory Organization

```
frontend/
├── src/
│   ├── components/
│   │   └── shared/
│   │       └── movieCard/
│   │           ├── MovieCard.tsx
│   │           └── MovieCard.test.tsx        # Component tests
│   ├── services/
│   │   ├── getSlug.ts
│   │   └── getSlug.test.ts                   # Utility tests
│   ├── stores/
│   │   ├── useUserStore.ts
│   │   └── useUserStore.test.ts              # Store tests
│   └── hooks/
│       ├── useAuth.ts
│       └── useAuth.test.ts                   # Hook tests
└── tests/
    ├── setup.ts                              # Test setup and configuration
    ├── mocks/
    │   ├── handlers.ts                       # MSW API mock handlers
    │   └── mockData.ts                       # Mock data factories
    ├── utils/
    │   └── test-utils.tsx                    # Custom render with providers
    └── integration/
        └── user-auth.test.ts                 # Integration tests
```

### File Naming Conventions

- Unit/Component tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `tests/integration/*.test.ts`
- Test utilities: `tests/utils/*.ts(x)`
- Mock data: `tests/mocks/*.ts`

## Writing Tests

### 1. Testing Utilities and Pure Functions

```typescript
import { describe, it, expect } from 'vitest';
import { getSlug } from './getSlug';

describe('getSlug', () => {
  it('should convert string to lowercase and replace spaces', () => {
    expect(getSlug('Test Movie')).toBe('test-movie');
  });

  it('should handle special characters', () => {
    expect(getSlug('Movie: Edition!')).toBe('movie-edition');
  });
});
```

### 2. Testing Zustand Stores

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from './useUserStore';
import { createMockUser } from '../../tests/mocks/mockData';

describe('useUserStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUserStore.setState({ user: null });
  });

  it('should set user correctly', () => {
    const mockUser = createMockUser();
    useUserStore.getState().setUser(mockUser);
    
    const { user } = useUserStore.getState();
    expect(user).toEqual(mockUser);
  });
});
```

### 3. Testing React Components

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import MovieCard from './MovieCard';

describe('MovieCard', () => {
  it('should render movie card with image', () => {
    render(
      <MovieCard 
        title="Test Movie"
        src="/poster.jpg"
        alt="Movie Poster"
      />
    );
    
    const image = screen.getByRole('img', { name: 'Movie Poster' });
    expect(image).toBeInTheDocument();
  });

  it('should handle user clicks', async () => {
    const user = userEvent.setup();
    render(<MovieCard title="Test" src="/test.jpg" alt="Test" />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    // Assert navigation or side effects
  });
});
```

### 4. Testing Custom Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import { createWrapper } from '../../tests/utils/test-utils';

describe('useAuth', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.login('user', 'pass');
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
```

### 5. Using Mock Data Factories

```typescript
import { createMockUser, createMockMovie } from '../../tests/mocks/mockData';

// Create mock user with defaults
const user = createMockUser();

// Override specific properties
const adminUser = createMockUser({ 
  role: 'admin',
  username: 'admin'
});

// Create mock movie
const movie = createMockMovie({
  title: 'Custom Movie',
  voteAverage: 9.5
});
```

### 6. Mocking API Calls with MSW

```typescript
// In your test file
import { server } from '../../tests/setup';
import { http, HttpResponse } from 'msw';

it('should handle API errors', async () => {
  // Override default handler for this test
  server.use(
    http.get('/api/movies', () => {
      return HttpResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    })
  );

  // Your test code that triggers the API call
});
```

## Best Practices

### Testing Philosophy

1. **Test Behavior, Not Implementation**
   - Focus on what users see and do
   - Avoid testing internal state or implementation details
   - Use semantic queries (getByRole, getByLabelText)

2. **Keep Tests Independent**
   - Each test should run in isolation
   - Use `beforeEach` to reset state
   - Don't rely on test execution order

3. **Use Meaningful Test Names**
   - Describe what the test does clearly
   - Use "should" pattern: "should render user name"
   - Group related tests with `describe` blocks

4. **Prefer User-Centric Queries**
   ```typescript
   // ✅ Good - queries that users see
   screen.getByRole('button', { name: 'Submit' })
   screen.getByLabelText('Email')
   screen.getByText('Welcome')
   
   // ❌ Avoid - implementation details
   screen.getByTestId('submit-btn')
   screen.getByClassName('btn-primary')
   ```

5. **Test Accessibility**
   - Use semantic HTML and ARIA roles
   - Verify keyboard navigation
   - Check screen reader content

### Common Patterns

#### Testing Async Operations

```typescript
import { waitFor } from '@testing-library/react';

it('should fetch and display data', async () => {
  render(<MyComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

#### Testing User Interactions

```typescript
import userEvent from '@testing-library/user-event';

it('should handle form submission', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);
  
  await user.type(screen.getByLabelText('Username'), 'testuser');
  await user.type(screen.getByLabelText('Password'), 'password');
  await user.click(screen.getByRole('button', { name: 'Login' }));
  
  expect(await screen.findByText('Welcome')).toBeInTheDocument();
});
```

#### Testing with Timers

```typescript
import { vi } from 'vitest';

it('should auto-dismiss after timeout', () => {
  vi.useFakeTimers();
  render(<Toast message="Test" />);
  
  vi.advanceTimersByTime(3000);
  
  expect(screen.queryByText('Test')).not.toBeInTheDocument();
  vi.restoreAllMocks();
});
```

### What to Test

✅ **Do Test:**
- User interactions (clicks, typing, navigation)
- Rendering with different props
- Conditional rendering
- Error states and edge cases
- Accessibility features
- API integration (with mocks)

❌ **Don't Test:**
- Third-party library internals
- Implementation details (internal state, private methods)
- Styling (unless critical to functionality)
- Browser APIs (unless abstracted)

## Examples

### Example 1: Testing a Form Component

```typescript
describe('SignUpForm', () => {
  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<SignUpForm onSubmit={onSubmit} />);
    
    await user.type(screen.getByLabelText('Username'), 'newuser');
    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'user@example.com',
        password: 'password123'
      });
    });
  });

  it('should show validation errors', async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));
    
    expect(screen.getByText('Username is required')).toBeInTheDocument();
  });
});
```

### Example 2: Testing a List Component with Loading States

```typescript
describe('MovieList', () => {
  it('should show loading state initially', () => {
    render(<MovieList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display movies after loading', async () => {
    render(<MovieList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
    });
  });

  it('should handle empty state', async () => {
    server.use(
      http.get('/api/movies', () => {
        return HttpResponse.json({ results: [] });
      })
    );
    
    render(<MovieList />);
    
    await waitFor(() => {
      expect(screen.getByText('No movies found')).toBeInTheDocument();
    });
  });
});
```

## Coverage Goals

- **Minimum Coverage**: 70% overall
- **Critical Paths**: 90%+ (authentication, data mutations)
- **Utilities**: 100%
- **Components**: Focus on behavior over percentage

Run coverage reports with:
```bash
npm run test:coverage
```

## Debugging Tests

### Common Issues

1. **"Unable to find element"**
   - Check if element is rendered asynchronously
   - Use `await findBy*` instead of `getBy*`
   - Verify the element actually exists in the DOM

2. **"Not wrapped in act(...)"**
   - Usually auto-handled by Testing Library
   - Ensure async updates use `waitFor`
   - Check that state updates happen in async functions

3. **Flaky Tests**
   - Avoid hard-coded timeouts
   - Use `waitFor` with proper conditions
   - Reset state between tests

### Debug Tips

```typescript
// Print current DOM structure
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));

// Log all queries
screen.logTestingPlaygroundURL();
```

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Pre-commit hooks (via Husky)

Ensure all tests pass before merging:
```bash
npm run lint
npm test
npm run test:integration
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [MSW Documentation](https://mswjs.io/docs/)

## Contributing

When adding new features:
1. Write tests alongside code
2. Follow existing patterns
3. Aim for high coverage of critical paths
4. Document complex test scenarios
5. Keep tests maintainable and readable

---

**Happy Testing! 🧪**
