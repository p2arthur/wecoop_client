interface ButtonProps {
  buttonText: string
  buttonFunction?(): void
  icon?: string | React.ReactNode
  inactive?: boolean
  className?: string
}

const Button = ({ buttonText, buttonFunction, icon, inactive }: ButtonProps) => {
  return (
    <div>
      <button
        className={`${inactive ? 'opacity-30' : 'null'} border-2 border-gray-900
         p-1  bg-white font-bold
          hover:bg-gray-200 active:bg-gray-300 flex items-center dark:border-gray-100 dark:text-gray-100 gap-2 border-b-4 active:border-b-transparent active:translate-y-px dark:border-b-4 dark:hover:bg-gray-800 dark:hover:text-gray-100`}
        onClick={buttonFunction}
        disabled={inactive}
      >
        <div className="rounded-md overflow-hidden">
          {' '}
          {typeof icon === 'string' ? <img className="w-6" src={icon as string} alt="" /> : icon}
        </div>
        {buttonText}
      </button>
    </div>
  )
}

export default Button
