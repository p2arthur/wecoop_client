interface LoaderSpinnerPropsInterface {
  text: string
}

const LoaderSpinner = ({ text }: LoaderSpinnerPropsInterface) => {
  return (
    <div className="flex flex-col justify-start md:justify-center items-center text-black dark:text-white">
      <img src={'/images/wecoop_loading.gif'} alt={'gif loading'} />
      <p>{text}</p>
    </div>
  )
}

export default LoaderSpinner
