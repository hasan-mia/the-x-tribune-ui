/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns The debounced function with cancel method
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number = 300
): {
    (...args: Parameters<T>): void;
    cancel: () => void;
} {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const debounced = function (this: any, ...args: Parameters<T>) {
        const context = this;

        // Clear existing timeout
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }

        // Set new timeout
        timeoutId = setTimeout(() => {
            func.apply(context, args);
            timeoutId = null;
        }, wait);
    };

    // Add cancel method to clear pending execution
    debounced.cancel = () => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    return debounced;
}

/**
 * React hook version of debounce for use in components
 * 
 * @param callback - The callback function to debounce
 * @param delay - The delay in milliseconds
 * @param dependencies - Dependency array for the callback
 * @returns The debounced callback function
 */
import { useCallback, useEffect, useRef } from 'react';

export function useDebounce<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = 300,
    dependencies: any[] = []
): T {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const debouncedCallback = useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay, ...dependencies]
    ) as T;

    return debouncedCallback;
}

/**
 * Hook to debounce a value
 * 
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// Add missing import
import { useState } from 'react';