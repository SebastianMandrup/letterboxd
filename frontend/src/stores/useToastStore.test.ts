import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useToastStore } from './useToastStore';

describe('useToastStore', () => {
    beforeEach(() => {
        // Reset store before each test
        useToastStore.setState({ toasts: [] });
        // Use fake timers
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('initializes with empty toasts array', () => {
        const { toasts } = useToastStore.getState();
        expect(toasts).toEqual([]);
    });

    it('adds a toast with success type', () => {
        useToastStore.getState().addToast('Test message', 'success');

        const { toasts } = useToastStore.getState();
        expect(toasts).toHaveLength(1);
        expect(toasts[0].message).toBe('Test message');
        expect(toasts[0].type).toBe('success');
        expect(toasts[0].id).toBeDefined();
    });

    it('adds a toast with error type', () => {
        useToastStore.getState().addToast('Error message', 'error');

        const { toasts } = useToastStore.getState();
        expect(toasts).toHaveLength(1);
        expect(toasts[0].type).toBe('error');
    });

    it('adds a toast with warning type', () => {
        useToastStore.getState().addToast('Warning message', 'warning');

        const { toasts } = useToastStore.getState();
        expect(toasts).toHaveLength(1);
        expect(toasts[0].type).toBe('warning');
    });

    it('adds multiple toasts', () => {
        useToastStore.getState().addToast('First message', 'success');
        useToastStore.getState().addToast('Second message', 'error');

        const { toasts } = useToastStore.getState();
        expect(toasts).toHaveLength(2);
        expect(toasts[0].message).toBe('First message');
        expect(toasts[1].message).toBe('Second message');
    });

    it('generates unique ids for each toast', () => {
        useToastStore.getState().addToast('First', 'success');
        useToastStore.getState().addToast('Second', 'success');

        const { toasts } = useToastStore.getState();
        expect(toasts[0].id).not.toBe(toasts[1].id);
    });

    it('removes toast by id', () => {
        useToastStore.getState().addToast('Test message', 'success');
        const { toasts } = useToastStore.getState();
        const toastId = toasts[0].id;

        useToastStore.getState().removeToast(toastId);

        const updatedToasts = useToastStore.getState().toasts;
        expect(updatedToasts).toHaveLength(0);
    });

    it('auto-removes toast after 3 seconds', () => {
        useToastStore.getState().addToast('Auto-remove message', 'success');

        expect(useToastStore.getState().toasts).toHaveLength(1);

        // Fast-forward time by 3 seconds
        vi.advanceTimersByTime(3000);

        expect(useToastStore.getState().toasts).toHaveLength(0);
    });

    it('does not remove other toasts when one is removed', () => {
        useToastStore.getState().addToast('First', 'success');
        useToastStore.getState().addToast('Second', 'error');

        const { toasts } = useToastStore.getState();
        const firstId = toasts[0].id;

        useToastStore.getState().removeToast(firstId);

        const updatedToasts = useToastStore.getState().toasts;
        expect(updatedToasts).toHaveLength(1);
        expect(updatedToasts[0].message).toBe('Second');
    });
});
