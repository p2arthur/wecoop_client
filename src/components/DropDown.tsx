import { Provider } from '@txnlab/use-wallet'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './Button'

interface DropDownOption {
  buttonText: string
  options: any
  icon?: string
  type: string
  address?: string
  children?: React.ReactNode
}

const DropDown = ({ options, buttonText, icon, type, address }: DropDownOption) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const dropDownButtonRenderer = () => {
    return (
      <div>
        <Button icon={icon} buttonText={buttonText} buttonFunction={handleOpenDropDown} />
      </div>
    )
  }

  const optionRenderer = () => {
    if (options) {
      return options.map((option: Provider) => {
        return type === 'connect' ? (
          <div className="bg-gray-100" key={option.metadata.name}>
            {' '}
            {/* Move the key attribute here */}
            <button
              className="w-full hover:bg-gray-300 hover:dark:bg-gray-800 flex gap-2 justify-center items-center dark:hover:text-gray-100 border-t-2 border-gray-900 dark:border-gray-100 h-8"
              onClick={option.connect}
            >
              <div className="rounded-full overflow-hidden flex items-center justify-center w-5">
                <img className="w-5" src={option.metadata.icon} alt="" />
              </div>
              <p className="font-bold">{option.metadata.name}</p>
            </button>
          </div>
        ) : type === 'activeAccount' ? (
          <div key={option.metadata.name}>
            {' '}
            {/* Move the key attribute here */}
            <button
              className="w-full hover:bg-gray-300 hover:dark:bg-gray-800 flex gap-2 justify-center items-center dark:hover:text-gray-100 border-t-2 border-gray-900 dark:border-gray-100 h-8"
              onClick={option.disconnect}
            >
              disconnect
            </button>
            <button
              className="w-full hover:bg-gray-300 hover:dark:bg-gray-800 flex gap-2 justify-center items-center dark:hover:text-gray-100 border-t-2 border-gray-900 dark:border-gray-100 h-8"
              onClick={() => navigate(`/profile/${address}`)}
            >
              profile
            </button>
          </div>
        ) : null
      })
    }

    return null
  }

  const handleOpenDropDown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div onClick={handleOpenDropDown}>
      <button className="p-2">
        <div className="flex flex-col relative z-50">
          {dropDownButtonRenderer()}
          {isOpen ? (
            <div className="absolute border-2 top-10 flex flex-col w-full bg-white border-gray-900 dark:border-gray-100 border-b-4">
              {optionRenderer()}
            </div>
          ) : null}
        </div>
      </button>
    </div>
  )
}

export { DropDown }
