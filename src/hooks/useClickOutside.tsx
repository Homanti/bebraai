import { useEffect } from 'react';
import type { RefObject } from 'react';

export function useClickOutside<T extends HTMLElement>(
    ref: RefObject<T | null>,
    handler: (event: MouseEvent | TouchEvent) => void,
    enabled = true,
    exceptionRef?: RefObject<HTMLElement | null>
) {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!enabled) return;

            const target = event.target as Node;

            const refEl = ref.current;
            const exceptionEl = exceptionRef?.current;

            if (!refEl) return;
            const clickedInsideRef = refEl.contains(target);
            const clickedOnException = exceptionEl?.contains(target) ?? false;

            if (clickedInsideRef || clickedOnException) return;

            handler(event);
        };

        document.addEventListener('mouseup', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mouseup', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler, enabled, exceptionRef]);
}
