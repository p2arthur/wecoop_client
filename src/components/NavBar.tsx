import ConnectWallet from './ConnectWallet'

const NavBar = () => {
  return (
    <div className="p-3 border-b-4 border-gray-900 flex justify-between items-center">
      <p className="font-bold text-3xl">$COOP</p>
      <ConnectWallet />
    </div>
  )
}

export default NavBar
