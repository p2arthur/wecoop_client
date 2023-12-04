interface ButtonProps {
  buttonText: string
  buttonFunction?(): void
}

const Button = ({ buttonText, buttonFunction }: ButtonProps) => {
  return (
    <div>
      <button className="border-2 border-gray-900 p-1 bg-white font-bold hover:bg-gray-200 active:bg-gray-300" onClick={buttonFunction}>
        {buttonText}
      </button>
    </div>
  )
}

export default Button
