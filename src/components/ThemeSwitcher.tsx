import { FaRegMoon } from 'react-icons/fa6'
import { RiSunLine } from 'react-icons/ri'
import useDarkMode from '../utils/getThemeMode'

const ThemeSwitcher = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  return (
    <button onClick={toggleDarkMode} className="p-0.1 border-2 border-black switch-theme flex items-center ">
      <div
        className={`
      moon p-1`}
      >
        <FaRegMoon className="text-gray-950 dark:text-gray-100 text-xs md:text-sm" />
      </div>

      <div className={`bg-black sun p-1`}>
        <RiSunLine className="dark:text-gray-950 text-gray-100 text-xs md:text-sm" />
      </div>
    </button>
  )
}

export default ThemeSwitcher
