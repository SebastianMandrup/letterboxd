# Test Examples

This directory contains comprehensive test examples demonstrating best practices for testing React applications.

## Overview

These example tests serve as a reference guide for writing tests in the Letterboxd frontend application. They demonstrate common patterns, techniques, and best practices that should be followed throughout the codebase.

## Example Test Files

### 1. `testing-hooks-with-react-query.test.tsx`

**Purpose**: Demonstrates how to test custom hooks that use React Query (TanStack Query).

**Key Concepts:**
- Setting up QueryClient for tests
- Mocking API responses with MSW
- Testing loading, success, and error states
- Using `renderHook` from React Testing Library
- Handling async operations with `waitFor`
- Disabling retry and cache for predictable tests

**Use this as reference when testing:**
- Custom hooks that fetch data
- Hooks using `useQuery` or `useMutation`
- Components that rely on React Query hooks

### 2. `testing-forms.test.tsx`

**Purpose**: Demonstrates comprehensive form testing patterns.

**Key Concepts:**
- Using `userEvent` for realistic user interactions
- Testing form validation logic
- Testing form submission (both success and error)
- Testing loading states during submission
- Accessibility-focused queries (`getByLabelText`, `getByRole`)
- Testing ARIA attributes for accessibility
- Testing keyboard navigation
- Mocking async form submission

**Use this as reference when testing:**
- Form components with validation
- User input and interactions
- Accessible form implementations
- Error handling in forms

## How to Use These Examples

1. **Read the examples** to understand the patterns and techniques used
2. **Copy and adapt** the patterns to your own test files
3. **Follow the comments** which explain why certain approaches are used
4. **Refer back** when you encounter similar testing scenarios

## Running These Examples

These example tests run as part of the regular test suite:

```bash
# Run all tests including examples
npm test

# Run only example tests
npm test tests/examples

# Run specific example file
npm test tests/examples/testing-forms.test.tsx
```

## Key Takeaways from Examples

### General Principles
1. **Test behavior, not implementation** - Focus on what users see and do
2. **Use realistic interactions** - Use `userEvent` over `fireEvent`
3. **Query accessibly** - Prefer `getByRole`, `getByLabelText` over test IDs
4. **Wait for async operations** - Use `waitFor`, `findBy*` queries
5. **Keep tests independent** - Each test should run in isolation

### React Query Testing
- Always create a fresh QueryClient per test
- Disable retry and cache for predictable behavior
- Test all query states: loading, success, error
- Use MSW to mock API responses consistently

### Form Testing
- Test user workflows, not individual functions
- Validate accessibility with ARIA attributes
- Test keyboard navigation
- Mock form submission handlers
- Test both success and error paths

## Adding New Examples

If you discover a new testing pattern that would benefit the team:

1. Create a new test file in this directory
2. Document the pattern with extensive comments
3. Include a variety of test cases
4. Add a section to this README explaining the example
5. Ensure all tests pass before committing

## Additional Resources

- [Main Testing Guide](../../TESTING.md) - Comprehensive testing documentation
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro)
- [TanStack Query Testing](https://tanstack.com/query/latest/docs/react/guides/testing)
- [MSW Documentation](https://mswjs.io/docs/)

---

**Remember**: These examples are living documentation. Update them as patterns evolve and new best practices emerge.
