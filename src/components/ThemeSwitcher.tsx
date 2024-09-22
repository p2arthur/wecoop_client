import useDarkMode from '../utils/getThemeMode'

const ThemeSwitcher = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  return (
    <button onClick={toggleDarkMode} className="switch-theme m-2">
      <div className={`sun dark:hidden w-14`}>
        <img src={'/images/lightmode.png'} alt={'lightMode button'} />
      </div>

      <div className={`moon hidden dark:block w-14`}>
        <img src={'/images/darkmode.png'} alt={'lightMode button'} />
      </div>
    </button>
  )
}

export default ThemeSwitcher
