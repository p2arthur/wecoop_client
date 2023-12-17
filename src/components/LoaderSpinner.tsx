import { FaSpinner } from 'react-icons/fa6'

interface LoaderSpinnerPropsInterface {
  text: string
}

const LoaderSpinner = ({ text }: LoaderSpinnerPropsInterface) => {
  return (
    <div className="h-10 flex flex-col justify-start md:justify-center items-center text-gray-500">
      <FaSpinner className="animate-spin text-3xl" />
      <p>{text}</p>
    </div>
  )
}

export default LoaderSpinner
