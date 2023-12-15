type DebounceFunction = (...args: any[]) => void

export function debounce(func: (...args: any[]) => void, delay: number): DebounceFunction {
  let timeoutId: NodeJS.Timeout

  return function (this: ThisParameterType<typeof func>, ...args: Parameters<typeof func>): void {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
