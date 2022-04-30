// 函数防抖的实现
function debounce<T>(fn: T, delay: number): any {
  let timer: any;
  return function (): void {
    const args: any[] = Array.prototype.map.call(arguments, (val) => val);
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(
      () => {
        typeof fn === 'function' && fn.apply(null, args);
        clearTimeout(timer);
      },
      delay > 0 ? delay : 100,
    );
  };
}

export default debounce;
