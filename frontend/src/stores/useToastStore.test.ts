import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useToastStore } from './useToastStore';

describe('useToastStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useToastStore.setState({ toasts: [] });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with empty toasts array', () => {
    const { toasts } = useToastStore.getState();
    expect(toasts).toEqual([]);
  });

  it('should add a toast with generated id', () => {
    useToastStore.getState().addToast('Test message', 'success');
    
    const { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(1);
    expect(toasts[0]).toMatchObject({
      message: 'Test message',
      type: 'success',
    });
    expect(toasts[0].id).toBeDefined();
  });

  it('should add multiple toasts', () => {
    useToastStore.getState().addToast('First message', 'success');
    useToastStore.getState().addToast('Second message', 'error');
    
    const { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(2);
    expect(toasts[0].message).toBe('First message');
    expect(toasts[1].message).toBe('Second message');
  });

  it('should remove a toast by id', () => {
    useToastStore.getState().addToast('Test message', 'success');
    const { toasts } = useToastStore.getState();
    const toastId = toasts[0].id;
    
    useToastStore.getState().removeToast(toastId);
    
    const updatedToasts = useToastStore.getState().toasts;
    expect(updatedToasts).toHaveLength(0);
  });

  it('should auto-remove toast after 3 seconds', () => {
    useToastStore.getState().addToast('Test message', 'success');
    
    let { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(1);
    
    // Fast-forward time by 3 seconds
    vi.advanceTimersByTime(3000);
    
    toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(0);
  });

  it('should support different toast types', () => {
    useToastStore.getState().addToast('Success message', 'success');
    useToastStore.getState().addToast('Error message', 'error');
    useToastStore.getState().addToast('Warning message', 'warning');
    
    const { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(3);
    expect(toasts[0].type).toBe('success');
    expect(toasts[1].type).toBe('error');
    expect(toasts[2].type).toBe('warning');
  });
});
