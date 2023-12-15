export function debounce(func: Function, delay: number): () => void {
  let timeoutId: NodeJS.Timeout

  // eslint-disable-next-line no-use-before-define
  return (...args: any[]): void => {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      // eslint-disable-next-line no-use-before-define
      func.apply(this, args)
    }, delay)
  }
}