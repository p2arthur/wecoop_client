import moon from '../assets/moon.png'
import sun from '../assets/sun.png'
import useDarkMode from '../utils/getThemeMode'

const ThemeSwitcher = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  return (
    <button onClick={toggleDarkMode} className="p-0.5 border-2 border-black switch-theme ">
      <div
        className={`
      moon p-1`}
      >
        <img src={moon} alt="moon" />
      </div>

      <div className={`bg-black sun p-1`}>
        <img src={sun} alt="sun" />
      </div>
    </button>
  )
}

export default ThemeSwitcher
