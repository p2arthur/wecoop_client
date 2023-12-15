// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type DebounceFunction<T extends (...args: any[]) => void> = (...args: Parameters<T>) => void

export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): DebounceFunction<T> {
  let timeoutId: NodeJS.Timeout

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
