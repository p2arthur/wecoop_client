interface ButtonProps {
  buttonText: string
  buttonFunction(): void
}

const Button = ({ buttonText, buttonFunction }: ButtonProps) => {
  return (
    <div>
      <button className="border-2 border-gray-900 p-1 bg-white" onClick={buttonFunction}>
        {buttonText}
      </button>
    </div>
  )
}

export default Button
