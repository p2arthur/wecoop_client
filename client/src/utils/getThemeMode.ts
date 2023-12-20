import { useEffect, useState } from 'react'

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode)
  }

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('dark-mode')

    if (storedDarkMode !== null) {
      setIsDarkMode(storedDarkMode === 'true')
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  useEffect(() => {
    const isDarkModeLabel = isDarkMode ? 'true' : 'false'
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem('dark-mode', isDarkModeLabel)
  }, [isDarkMode])

  return { isDarkMode, toggleDarkMode }
}

export default useDarkMode
