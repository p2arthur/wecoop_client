interface ButtonProps {
  buttonText?: string
  icon?: string | React.ReactNode
  inactive?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  ellipsis?: boolean
  full?: boolean
  justify?: 'center' | 'start' | 'end'
  pinging?: boolean
  buttonFunction?(): void
}

const Button = ({
  buttonText,
  buttonFunction,
  icon,
  inactive,
  type,
  justify,
  full = false,
  ellipsis = false,
  pinging,
}: ButtonProps) => {
  return (
    <div className="relative flex justify-center items-center">
      {pinging && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-2/3 h-5/6 bg-white border-2 border-black opacity-50 animate-ping"></div>
        </div>
      )}

      <button
        type={type}
        className={`${inactive ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200 active:bg-gray-300'}
          border-2 border-gray-900 p-2 bg-white font-bold
          ${justify && `justify-${justify}`}
          ${full ? 'w-full ' : 'w-auto'}
          flex items-center gap-2 border-b-4 active:border-b-transparent active:translate-y-px
          dark:border-gray-100 dark:border-b-4 dark:hover:bg-gray-800 dark:hover:text-gray-100 text-md md:text-xl 
          relative z-10`}
        onClick={buttonFunction}
        disabled={inactive}
      >
        {icon && (
          <div>
            {typeof icon === 'string' ? <img className="w-6" src={icon as string} alt="" /> : icon}
          </div>
        )}
        {buttonText && <p className={`${ellipsis ? 'overflow-hidden truncate w-32' : ''}`}>{buttonText}</p>}
      </button>
    </div>
  )
}

export default Button
