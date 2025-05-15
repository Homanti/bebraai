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

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler, enabled, exceptionRef]);

}


// import { useEffect } from 'react';
// import type { RefObject } from 'react';
//
// export function useClickOutside<T extends HTMLElement>(
//     ref: RefObject<T | null>,
//     handler: (event: MouseEvent | TouchEvent) => void,
//     enabled = true,
//     exceptionRef?: RefObject<HTMLElement | null>
// ) {
//     useEffect(() => {
//         const listener = (event: MouseEvent | TouchEvent) => {
//             if (!enabled) return;
//
//             const target = event.target as Node;
//
//             const clickedInsideRef = ref.current && ref.current.contains(target);
//             const clickedOnException = exceptionRef?.current && exceptionRef.current.contains(target);
//
//             if (clickedInsideRef || clickedOnException) return;
//
//             handler(event);
//         };
//
//         document.addEventListener('mousedown', listener);
//         document.addEventListener('touchstart', listener);
//         return () => {
//             document.removeEventListener('mousedown', listener);
//             document.removeEventListener('touchstart', listener);
//         };
//     }, [ref, handler, enabled, exceptionRef]);
// }