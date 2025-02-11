import { useWallet } from '@txnlab/use-wallet'
import { useState } from 'react'
import { FaEye } from 'react-icons/fa'
import Footer from '../components/Footer'
import { useTrenches } from '../context/the_trenches/TheTrenchesContext'

export default function TheTrenches() {
  const [oracleInputText, setOracleInputText] = useState('')
  const [agentName, setAgentName] = useState('')
  const { makeRagQuery, createUserAgent, trenchOracleState } = useTrenches()
  const { activeAccount } = useWallet()

  const handleUserInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = event.target.value
    setOracleInputText(userInput)
  }
  const handleUserAgentInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = event.target.value
    setAgentName(userInput)
  }

  const handleAskOracle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    makeRagQuery(oracleInputText)
  }
  const handleCreateUserAgent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!activeAccount) return
    createUserAgent(activeAccount.address, agentName)
  }

  return (
    <div className="w-full px-4 flex flex-col gap-4 py-20 dark:bg-gray-950 bg-gray-100">
      <div className="flex justify-center items-center gap-4">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl">You're in</h2>
          <h1 className="text-4xl font-bold mb-4 text-center underline">The trenches</h1>
        </div>
        <div className="h-32">
          <img className="h-full" src="/images/trench.jpg" alt="trenches-image" />
        </div>
      </div>
      {/* <p className="text-center italic text-gray-500 mb-8">Developed by iam_p2</p> */}

      <div className="flex flex-col border-2 border-b-4 border-black p-2">
        <div className="flex gap-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Trenches oracle
            <FaEye />
          </h2>
          <h2 className="text-xl font-bold"> - Pay small fee to ask the oracle</h2>
        </div>
        <form onSubmit={handleAskOracle}>
          <input onChange={handleUserInput} className="w-full h-32" placeholder="Ask the oracle about the Algorand trenches" type="text" />
        </form>
        <div className="border-2 border-gray-950 p-2">
          <h2 className="font-bold">Oracle response - Responds like a trench advisor:</h2>
          <h3 className="text-gray-800">{trenchOracleState.text}</h3>
        </div>
      </div>
      <div className="flex flex-col border-2 border-b-4 border-black p-2">
        <div>
          <h2 className="text-xl font-bold underline">
            Trenches Agent - Make 5 posts + pay price to mint agent level 1 (Add user context)
          </h2>
        </div>
        <div>
          <h3>Create agent</h3>
          <form onSubmit={handleCreateUserAgent}>
            <input onChange={handleUserAgentInput} className="" placeholder="What is your agent name?" type="text" />
          </form>
        </div>
        <div className="p-2">
          <h2 className="font-bold text-xl">Your trench agents:</h2>
          <div>
            <div className="h-32">
              <img className="h-full" src="/images/pixel_anon74.png" alt="" />
            </div>
            <h3 className='text-xl'>Curupira agent</h3>
            <h5 className='text-gray-700 text-sm'>Updated at: 23/01/2025</h5>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
