import ConnectWallet from './ConnectWallet'

const NavBar = () => {
  return (
    <div className="p-3 border border-gray-900 flex  border-b-2 justify-between items-center">
      <p className="font-bold">SCOOP</p>
      <ConnectWallet />
    </div>
  )
}

export default NavBar
