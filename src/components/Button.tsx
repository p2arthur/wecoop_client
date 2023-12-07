interface ButtonProps {
  buttonText: string
  buttonFunction?(): void
  icon?: string
  inactive?: boolean
  className?: string
}

const Button = ({ buttonText, buttonFunction, icon, inactive }: ButtonProps) => {
  return (
    <div>
      <button
        className={`${inactive ? 'opacity-30' : 'null'} border-2 border-gray-900
         p-1  bg-white font-bold
          hover:bg-gray-200 active:bg-gray-300 flex items-center dark:bg-gray-100 dark:text-gray-950`}
        onClick={buttonFunction}
        disabled={inactive}
      >
        {icon ? <img className="w-6" src={icon} alt="" /> : null}
        {buttonText}
      </button>
    </div>
  )
}

export default Button
