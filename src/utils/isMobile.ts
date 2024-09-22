export const isMobileDevice = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768
  }

  return false
}
