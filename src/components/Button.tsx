interface ButtonProps {
  buttonText?: string
  icon?: string | React.ReactNode
  inactive?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  ellipsis?: boolean
  full?: boolean
  justify?: 'center' | 'start' | 'end'

  buttonFunction?(): void
}

const Button = ({ buttonText, buttonFunction, icon, inactive, type, justify, full = false, ellipsis = false }: ButtonProps) => {
  return (
    <div>
      <button
        type={type}
        className={`${inactive ? 'opacity-30 z-1' : 'null'} border-2 border-gray-900
         p-1  bg-white font-bold
         ${justify && `justify-${justify}`}
        ${full ? 'w-full ' : 'w-auto'}
          hover:bg-gray-200 active:bg-gray-300 flex items-center dark:border-gray-100 dark:text-gray-100 gap-2 border-b-4 active:border-b-transparent active:translate-y-px dark:border-b-4 dark:hover:bg-gray-800 dark:hover:text-gray-100 text-md md:text-xl`}
        onClick={buttonFunction}
        disabled={inactive}
      >
        {icon && <div> {typeof icon === 'string' ? <img className="w-6" src={icon as string} alt="" /> : icon}</div>}
        {buttonText && <p className={`${ellipsis && 'overflow-hidden truncate w-32'}`}> {buttonText}</p>}
      </button>
    </div>
  )
}

export default Button
