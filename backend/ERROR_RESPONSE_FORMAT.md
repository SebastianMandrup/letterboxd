# Error Response Format

## Overview

After the ApiError refactor, all API errors now follow a consistent format handled by the `errorHandler` middleware.

## Error Response Structure

All error responses follow this structure:

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Error message describing what went wrong",
    "code": 400
  }
}
```

### Development Mode

In development mode, the error response also includes a stack trace:

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Error message",
    "code": 500,
    "stack": "Error: ...\n    at ..."
  }
}
```

## ApiError Class

The `ApiError` class is used to create errors with specific status codes:

```typescript
import { ApiError } from '../middleware/errorHandler';

// Example usage in route handlers
throw new ApiError('Movie not found', 404);
throw new ApiError('Unauthorized', 401);
throw new ApiError('Invalid input', 400);
```

## Best Practices for Route Handlers

### 1. Use async/await with try-catch

```typescript
router.get('/:id', async (req, res, next) => {
    try {
        const item = await getItemById(req.params.id);
        
        if (!item) {
            throw new ApiError('Item not found', 404);
        }
        
        res.status(200).send(item);
    } catch (error) {
        next(error);
    }
});
```

### 2. Always call next(error) in catch blocks

Never let errors go unhandled. Always pass them to the error handler:

```typescript
// ✅ Correct
catch (error) {
    next(error);
}

// ❌ Wrong - leaves request hanging
catch (error) {
    console.error(error);
}

// ❌ Wrong - doesn't use standard format
catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
}
```

### 3. Use ApiError for custom status codes

```typescript
// ✅ Correct - uses ApiError for 404
if (!user) {
    throw new ApiError('User not found', 404);
}

// ❌ Wrong - will return 500 instead of 404
if (!user) {
    throw new Error('User not found');
}
```

## Middleware Error Handling

### Synchronous Middleware

Wrap validation logic in try-catch:

```typescript
export const validateSomething = (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = validator(req.body.field);
        req.body.field = validated;
        next();
    } catch (error) {
        next(error);
    }
};
```

### Async Middleware

```typescript
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUserFromSession(req);
        
        if (!user) {
            throw new ApiError('Unauthorized', 401);
        }
        
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
```

## Frontend Integration

The frontend's `apiClient` automatically handles this error format via its response interceptor:

```typescript
this.axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Extracts error.response.data.error.message
        const errorMessage = error.response?.data?.error?.message || 
                           error.message || 
                           'An unexpected error occurred';
        
        const backendError: BackendError = new Error(errorMessage);
        backendError.name = 'ApiError';
        backendError.status = error.response?.status;
        return Promise.reject(backendError);
    },
);
```

Frontend code can then catch and display these errors:

```typescript
try {
    await listClient.create(data);
} catch (error: BackendError | unknown) {
    if (error instanceof BackendError) {
        addToast(error.message, 'error');
    } else {
        addToast('An unexpected error occurred.', 'error');
    }
}
```

## Common HTTP Status Codes

- `400` - Bad Request (validation errors, invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (unexpected errors)

## Testing

When writing tests, expect the full error response structure:

```typescript
const res = await request(app).get('/movies/nonexistent');

expect(res.status).toBe(404);
expect(res.body).toEqual({
    success: false,
    data: null,
    error: {
        message: 'Movie not found',
        code: 404,
    },
});
```
