import { useEffect, useState } from 'react'

const useDarkMode = () => {
  // Use localStorage value as the initial state or default to false
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedMode = localStorage.getItem('dark-mode')
    return storedMode === 'true'
  })

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode)
  }

  useEffect(() => {
    const isDarkModeLabel = isDarkMode ? 'true' : 'false'
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem('dark-mode', isDarkModeLabel)
  }, [isDarkMode])

  return { isDarkMode, toggleDarkMode }
}

export default useDarkMode
