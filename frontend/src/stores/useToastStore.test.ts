import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useToastStore } from './useToastStore';

describe('useToastStore', () => {
    beforeEach(() => {
        // Reset store state before each test
        useToastStore.setState({ toasts: [] });
        // Clear all timers
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should initialize with empty toasts array', () => {
        const state = useToastStore.getState();
        expect(state.toasts).toEqual([]);
    });

    it('should add a success toast', () => {
        useToastStore.getState().addToast('Success message', 'success');
        const state = useToastStore.getState();

        expect(state.toasts).toHaveLength(1);
        expect(state.toasts[0].message).toBe('Success message');
        expect(state.toasts[0].type).toBe('success');
        expect(state.toasts[0].id).toBeDefined();
    });

    it('should add an error toast', () => {
        useToastStore.getState().addToast('Error message', 'error');
        const state = useToastStore.getState();

        expect(state.toasts).toHaveLength(1);
        expect(state.toasts[0].message).toBe('Error message');
        expect(state.toasts[0].type).toBe('error');
    });

    it('should add a warning toast', () => {
        useToastStore.getState().addToast('Warning message', 'warning');
        const state = useToastStore.getState();

        expect(state.toasts).toHaveLength(1);
        expect(state.toasts[0].message).toBe('Warning message');
        expect(state.toasts[0].type).toBe('warning');
    });

    it('should add multiple toasts', () => {
        useToastStore.getState().addToast('First message', 'success');
        useToastStore.getState().addToast('Second message', 'error');
        useToastStore.getState().addToast('Third message', 'warning');

        const state = useToastStore.getState();

        expect(state.toasts).toHaveLength(3);
        expect(state.toasts[0].message).toBe('First message');
        expect(state.toasts[1].message).toBe('Second message');
        expect(state.toasts[2].message).toBe('Third message');
    });

    it('should generate unique IDs for toasts', () => {
        useToastStore.getState().addToast('First', 'success');
        useToastStore.getState().addToast('Second', 'error');

        const state = useToastStore.getState();

        expect(state.toasts[0].id).not.toBe(state.toasts[1].id);
    });

    it('should remove a toast by ID', () => {
        useToastStore.getState().addToast('Test message', 'success');
        const state = useToastStore.getState();
        const toastId = state.toasts[0].id;

        useToastStore.getState().removeToast(toastId);
        const newState = useToastStore.getState();

        expect(newState.toasts).toHaveLength(0);
    });

    it('should not remove other toasts when removing one', () => {
        useToastStore.getState().addToast('First', 'success');
        useToastStore.getState().addToast('Second', 'error');
        useToastStore.getState().addToast('Third', 'warning');

        const state = useToastStore.getState();
        const secondToastId = state.toasts[1].id;

        useToastStore.getState().removeToast(secondToastId);
        const newState = useToastStore.getState();

        expect(newState.toasts).toHaveLength(2);
        expect(newState.toasts[0].message).toBe('First');
        expect(newState.toasts[1].message).toBe('Third');
    });

    it('should auto-remove toast after 3 seconds', () => {
        useToastStore.getState().addToast('Auto-remove message', 'success');

        let state = useToastStore.getState();
        expect(state.toasts).toHaveLength(1);

        // Fast-forward time by 3 seconds
        vi.advanceTimersByTime(3000);

        state = useToastStore.getState();
        expect(state.toasts).toHaveLength(0);
    });

    it('should handle removing non-existent toast', () => {
        useToastStore.getState().addToast('Test message', 'success');
        const state = useToastStore.getState();

        useToastStore.getState().removeToast('non-existent-id');
        const newState = useToastStore.getState();

        expect(newState.toasts).toHaveLength(1);
        expect(newState.toasts[0]).toEqual(state.toasts[0]);
    });

    it('should handle multiple auto-removes correctly', () => {
        useToastStore.getState().addToast('First', 'success');
        vi.advanceTimersByTime(1000);
        useToastStore.getState().addToast('Second', 'error');
        vi.advanceTimersByTime(1000);
        useToastStore.getState().addToast('Third', 'warning');

        let state = useToastStore.getState();
        expect(state.toasts).toHaveLength(3);

        // First toast should be removed after 1 more second (total 3 seconds)
        vi.advanceTimersByTime(1000);
        state = useToastStore.getState();
        expect(state.toasts).toHaveLength(2);

        // Second toast should be removed after 1 more second
        vi.advanceTimersByTime(1000);
        state = useToastStore.getState();
        expect(state.toasts).toHaveLength(1);

        // Third toast should be removed after 1 more second
        vi.advanceTimersByTime(1000);
        state = useToastStore.getState();
        expect(state.toasts).toHaveLength(0);
    });
});
