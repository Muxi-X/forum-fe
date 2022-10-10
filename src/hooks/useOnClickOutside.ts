import { useEffect } from 'react';

interface Selector {
  id?: string;
  class?: string;
}

const useOnClickOutside = (
  el: Element | 'noEl',
  callback: Function,
  selector?: Selector,
) => {
  useEffect(() => {
    const handler = (event: any) => {
      if (!el) return;
      if (el !== 'noEl') {
        if (selector?.class) {
          if (
            document
              .getElementsByClassName(selector.class)[0]
              .children[0].contains(event.target)
          )
            return;
          if (!el.contains(event.target)) {
            callback();
          }
        }
      } else {
        const ele = document.getElementById(selector?.id as string);
        if (!ele?.contains(event.target)) callback();
      }
    };
    window.addEventListener('click', handler);

    return () => window.removeEventListener('click', handler);
  }, [callback, el]);
};

export default useOnClickOutside;
