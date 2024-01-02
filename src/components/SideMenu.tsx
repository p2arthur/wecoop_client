import { useState } from 'react'

interface SideMenuProps {
  toggleMenu: () => void
}

const Backdrop = ({ onClick }: { onClick: () => void }) => (
  <div onClick={onClick} className="fixed z-50 opacity-50 bg-gray-950 top-0 left-0 flex h-full w-full"></div>
)

const MenuItems = () => (
  <div className="w-52 bg-gray-100 fixed h-full opacity-100 top-0 right-0 overflow-y-auto z-50">
    <ul className="flex flex-col">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
      {/* Add more items as needed */}
    </ul>
  </div>
)

const SideMenu = ({ toggleMenu }: SideMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleMenuState = () => {
    setIsOpen(!isOpen)
    toggleMenu()
  }

  return (
    <>
      {isOpen && <Backdrop onClick={handleMenuState} />}
      {isOpen && <MenuItems />}
    </>
  )
}

export default SideMenu
