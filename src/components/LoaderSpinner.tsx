import useDarkMode from '../utils/getThemeMode'

interface LoaderSpinnerPropsInterface {
  text: string
}

const LoaderSpinner = ({ text }: LoaderSpinnerPropsInterface) => {
  const { isDarkMode } = useDarkMode()
  return (
    <div className="flex flex-col justify-start md:justify-center items-center text-black dark:text-white">
      <img src={!isDarkMode ? '/images/wecoop_loading.gif' : '/images/wecoop_loading_white.gif'} alt={'gif loading'} />
      <p>{text}</p>
    </div>
  )
}

export default LoaderSpinner
