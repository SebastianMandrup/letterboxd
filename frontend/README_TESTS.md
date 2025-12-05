# Frontend Tests - Quick Start

## Running Tests

```bash
# Install dependencies
npm install

# Run all unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run integration tests (requires backend)
npm run test:integration
```

## Test Files

All tests are co-located with their source files for easy discovery:

```
src/
├── components/shared/
│   ├── movieCard/
│   │   ├── MovieCard.tsx
│   │   └── MovieCard.test.tsx ✓
│   └── userCard/
│       ├── UserCard.tsx
│       └── UserCard.test.tsx ✓
├── hooks/
│   ├── useAuth.ts
│   └── useAuth.test.ts ✓
├── services/
│   ├── getSlug.ts
│   ├── getSlug.test.ts ✓
│   └── ... (other utilities with tests)
└── stores/
    ├── useUserStore.ts
    ├── useUserStore.test.ts ✓
    └── ... (other stores with tests)
```

## Test Statistics

- **Total**: 53 tests across 9 files
- **Pass Rate**: 100% ✅
- **Categories**: Unit (18), Component (14), Store (16), Hook (4)

## Documentation

See [TEST_COVERAGE.md](./TEST_COVERAGE.md) for comprehensive documentation.
