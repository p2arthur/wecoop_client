import { useWallet } from '@txnlab/use-wallet'
import { useEffect, useRef, useState } from 'react'
import { FaEye } from 'react-icons/fa'
import Button from '../components/Button'
import Footer from '../components/Footer'
import { useTrenches } from '../context/the_trenches/TheTrenchesContext'
import { usableAssetsList } from '../data/usableAssetsList'
import { ellipseAddress } from '../utils/ellipseAddress'
import defineAgentCreationMessage from '../utils/the-trenches/defineAgentCreationMessage'

export interface Message {
  sender: 'oracle' | 'user'
  content: string
}

export default function TheTrenches() {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [oracleInputText, setOracleInputText] = useState('')
  const [agentName, setAgentName] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const { makeRagQuery, createUserAgent, trenchOracleState, trenchUser, getUserAgent } = useTrenches()
  const { activeAccount } = useWallet()
  const [isOracleLoading, setIsOracleLoading] = useState(false)
  const [isAgentCreating, setIsAgentCreating] = useState(false)

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Set initial welcome message
  useEffect(() => {
    setMessages([{ sender: 'oracle', content: 'Welcome to the trenches. How may I assist you today?' }])
  }, [])

  // Watch for changes in trenchOracleState and update messages
  useEffect(() => {
    if (trenchOracleState.text && isOracleLoading) {
      setMessages((prev) => [...prev, { sender: 'oracle', content: trenchOracleState.text }])
      setIsOracleLoading(false)
    }
  }, [trenchOracleState.text])

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
    if (!oracleInputText.trim()) return

    setIsOracleLoading(true)

    // Add user message to history
    setMessages((prev) => [...prev, { sender: 'user', content: oracleInputText }])

    try {
      // Make the API call
      await makeRagQuery(oracleInputText, messages)
      // The oracle response will be handled by the useEffect above

      // Clear input
      setOracleInputText('')
    } catch (error) {
      setIsOracleLoading(false)
      // Optionally add an error message to the chat
      setMessages((prev) => [...prev, { sender: 'oracle', content: 'Sorry, I encountered an error. Please try again.' }])
    }
  }
  const handleCreateUserAgent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!activeAccount) return
    setIsAgentCreating(true)
    try {
      await createUserAgent(activeAccount.address, agentName)
    } finally {
      setIsAgentCreating(false)
    }
  }

  useEffect(() => {
    console.log('Trench user:', trenchUser)
    if (!trenchUser.walletAddress) return
    getUserAgent(trenchUser.walletAddress)
  }, [trenchUser])

  return (
    <div className="w-full px-4 flex flex-col gap-2 py-20 dark:bg-gray-950 bg-gray-100 overflow-y-hidden">
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

      <div className="flex gap-4">
        <div className="flex flex-col border-2 border-b-4 border-black p-2 w-1/2">
          <div className="flex gap-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Trenches oracle
              <FaEye />
            </h2>
            <h2 className="text-xl font-bold"> - Pay small fee to ask the oracle</h2>
          </div>
          <div className="flex flex-col h-96 overflow-y-auto border-2 border-gray-950 bg-white p-4 mb-4" ref={chatContainerRef}>
            <div className="flex flex-col gap-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${message.sender === 'user' ? 'self-end bg-blue-500 text-white rounded-br-none' : 'self-start bg-gray-200 rounded-bl-none'
                    } rounded-lg p-3 max-w-[80%]`}
                >
                  <p className="text-sm font-bold">{message.sender === 'user' ? 'You' : 'Oracle'}</p>
                  <p>{message.content}</p>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={handleAskOracle} className="flex gap-2">
            <input
              value={oracleInputText}
              onChange={handleUserInput}
              className="flex-1 p-2 border-2 border-gray-300 rounded"
              placeholder="Type your message..."
              type="text"
              disabled={isOracleLoading}
            />
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
              buttonText={isOracleLoading ? 'Sending...' : 'Send'}
            />
          </form>
        </div>
        <div className="flex w-1/2 flex-col border-2 border-b-4 border-black p-2 gap-2">
          <div className="flex gap-2 text-lg font-bold">
            <h3 className="font-bold">Trenches Agent - </h3>
            <h4 className="font-bold underline">{defineAgentCreationMessage(trenchUser.posts?.length!)}</h4>
          </div>
          {trenchUser.ai_agent?.agent_name && (
            <div className="flex flex-col gap-2">
              <div className="p-2 border-2 border-black flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="w-44 h-32">
                    <img className="h-full" src="/images/pixel_anon74.png" alt="" />
                  </div>
                  <div className="flex flex-col gap-2 w-1/2">
                    <h3 className="text-xl font-bold">{trenchUser.ai_agent.agent_name || 'no agent'}</h3>
                    <h4 className="text-black font-bold">Updated at:</h4>
                    <h5 className="text-gray-700">{trenchUser.ai_agent.updated_at}</h5>
                    <div className="flex flex-col">
                      <h4 className="text-xl">Agent address:</h4>
                      <h5 className="text-gray-700 text-sm">{ellipseAddress(trenchUser.ai_agent.agent_wallet_address)}</h5>
                    </div>
                  </div>
                  <div className="w-1/2 flex flex-col gap-2">
                    <h3 className="text-xl font-bold">Agent funds:</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {usableAssetsList.map((usableAsset) => (
                        <div className="flex gap-1">
                          <img className="w-6 h-6 rounded-full overflow-hidden" src={usableAsset.image} />
                          <h5>0.0</h5>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* <form className='w-full h-full' action=""><input className='w-full h-full' type="text" /></form> */}
                </div>
                <div className="border-2 border-black">
                  <h3 className="text-sm font-bold absolute px-2">Level 3 - {trenchUser.posts?.length} posts on the trenches</h3>
                  <div className="w-96 bg-green-500 h-5"></div>
                </div>
              </div>
            </div>
          )}

          {!trenchUser.walletAddress && <div>Connect your wallet to enter the trenches</div>}
          {!trenchUser.ai_agent?.agent_name && activeAccount && (
            <div>
              {' '}
              <h3>Create agent</h3>
              <form onSubmit={handleCreateUserAgent} className="flex flex-col gap-2">
                <input
                  onChange={handleUserAgentInput}
                  className="border-2 border-black"
                  required
                  placeholder="What is your agent name?"
                  type="text"
                  disabled={isAgentCreating}
                />
                <Button
                  type="submit"
                  buttonText={isAgentCreating ? 'Creating Agent...' : 'Create Agent'}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                />
              </form>
            </div>
          )}
          <div className="w-full">
            <div className="flex flex-col border-2 border-b-4 border-black p-2">
              <div className="flex gap-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Agent chat
                  <FaEye />
                </h2>
                <h2 className="text-xl font-bold"> - Pay small fee to use the agent</h2>
              </div>
              <div className="flex flex-col h-40 overflow-y-auto border-2 border-gray-950 bg-white p-4 mb-4" ref={chatContainerRef}>
                <div className="flex flex-col gap-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`${message.sender === 'user' ? 'self-end bg-blue-500 text-white rounded-br-none' : 'self-start bg-gray-200 rounded-bl-none'
                        } rounded-lg p-3 max-w-[80%]`}
                    >
                      <p className="text-sm font-bold">{message.sender === 'user' ? 'You' : 'Oracle'}</p>
                      <p>{message.content}</p>
                    </div>
                  ))}
                </div>
              </div>
              <form onSubmit={handleAskOracle} className="flex gap-2">
                <input
                  value={oracleInputText}
                  onChange={handleUserInput}
                  className="flex-1 p-2 border-2 border-gray-300 rounded"
                  placeholder="Type your message..."
                  type="text"
                  disabled={isOracleLoading}
                />
                <Button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                  buttonText={isOracleLoading ? 'Sending...' : 'Send'}
                />
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
