import { useEffect } from 'react';

const useOnClickOutside = (el: Element, callback: Function) => {
  useEffect(() => {
    const handler = (event: any) => {
      if (!el) return;
      if (
        document
          .getElementsByClassName('anticon-smile')[0]
          .children[0].contains(event.target)
      )
        return;
      if (!el.contains(event.target)) {
        callback();
      }
    };
    window.addEventListener('click', handler);

    return () => window.removeEventListener('click', handler);
  }, [callback, el]);
};

export default useOnClickOutside;
