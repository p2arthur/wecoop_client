interface ButtonProps {
  buttonText: string
  buttonFunction?(): void
  icon?: string
}

const Button = ({ buttonText, buttonFunction, icon }: ButtonProps) => {
  return (
    <div>
      <button
        className="border-2 border-gray-900 p-1 bg-white font-bold hover:bg-gray-200 active:bg-gray-300 flex items-center"
        onClick={buttonFunction}
      >
        {icon ? <img className="w-6" src={icon} alt="" /> : null}
        {buttonText}
      </button>
    </div>
  )
}

export default Button
