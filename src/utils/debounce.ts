export function debounce(func: Function, delay: number): () => void {
  let timeoutId: NodeJS.Timeout;

  return function(): void {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
}
