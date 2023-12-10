import { Provider, useWallet } from '@txnlab/use-wallet'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './Button'

interface DropDownOption {
  buttonText: string
  options: Provider[] | null
  icon?: string
  type: string
  address?: string
}

const DropDown = ({ options, buttonText, icon, type, address }: DropDownOption) => {
  const [isOpen, setIsOpen] = useState(false)
  const { activeAccount } = useWallet()
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
      return options.map((option) => {
        return type === 'connect' ? (
          <div>
            <button className="border-2 w-full hover:bg-gray-300" onClick={option.connect} key={option.metadata.name}>
              {option.metadata.name}
            </button>
          </div>
        ) : (
          <div>
            <button className="border-2 w-full hover:bg-gray-300" onClick={option.disconnect} key={option.metadata.name}>
              disconnect
            </button>
            <button
              className="border-2 w-full hover:bg-gray-300"
              onClick={() => navigate(`/profile/${address}`)}
              key={option.metadata.name}
            >
              profile
            </button>
          </div>
        )
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
        <div className="flex flex-col relative">
          {dropDownButtonRenderer()}
          {isOpen ? <div className="absolute top-10 flex flex-col w-full bg-white border-gray-900 border-2">{optionRenderer()}</div> : null}
        </div>
      </button>
    </div>
  )
}

export { DropDown }
