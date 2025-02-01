import { useWallet } from '@txnlab/use-wallet'
import { useEffect, useRef, useState } from 'react'
import { FaBiohazard, FaEye, FaWallet } from 'react-icons/fa'
import Button from '../components/Button'
import Footer from '../components/Footer'
import TrenchAgentsList from '../components/the-trenches/TrenchAgentsList'
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
  const {
    makeRagQuery,
    createUserAgent,
    trenchOracleState,
    trenchUser,
    getUserAgent,
    updateUserAgent,
    isAgentCreating,
    isAgentUpdating,
    isOracleLoading,
  } = useTrenches()
  const { activeAccount } = useWallet()

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

  useEffect(() => {
    if (trenchOracleState.text) {
      setMessages((prev) => [...prev, { sender: 'oracle', content: trenchOracleState.text }])
    }
  }, [trenchOracleState.text])

  const handleUserInput = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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

    // Add user message to history
    setMessages((prev) => [...prev, { sender: 'user', content: oracleInputText }])

    try {
      // Make the API call
      await makeRagQuery(oracleInputText, messages)
      // The oracle response will be handled by the useEffect above

      // Clear input
      setOracleInputText('')
    } catch (error) {
      // Optionally add an error message to the chat
      setMessages((prev) => [...prev, { sender: 'oracle', content: 'Sorry, I encountered an error. Please try again.' }])
    }
  }
  const handleCreateUserAgent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!activeAccount) return
    try {
      await createUserAgent(activeAccount.address, agentName)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdateUserAgent = async () => {
    if (!activeAccount) return

    try {
      updateUserAgent(activeAccount.address)
    } catch (error) {
      console.error('Error:', error)
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
        <div className="h-24">
          <img className="h-full" src="/images/trench.jpg" alt="trenches-image" />
        </div>
      </div>
      {/* <p className="text-center italic text-gray-500 mb-8">Developed by iam_p2</p> */}

      <div className="flex gap-4">
        <div className="flex flex-col border-2 border-b-4 border-black dark:bg-lime-600 p-2 w-1/2">
          <div className="flex gap-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Trenches oracle
              <FaEye />
            </h2>
            <h2 className="text-xl font-bold"> - Pay small fee to ask the oracle</h2>
          </div>
          <div
            className="flex flex-col h-96 overflow-y-auto border-2 border-gray-950 bg-white dark:bg-gray-900 p-4 mb-4"
            ref={chatContainerRef}
          >
            <div className="flex flex-col gap-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${message.sender === 'user' ? 'self-end bg-blue-500 text-white rounded-br-none' : 'self-start bg-lime-500 rounded-bl-none'
                    } rounded-lg p-3 max-w-[80%] border-t-4 border-black dark:border-white`}
                >
                  <p className="text-sm font-bold">{message.sender === 'user' ? 'You' : 'Oracle'}</p>
                  <p>{message.content}</p>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={handleAskOracle} className="flex gap-2">
            <div className="flex p-2 border-2 border-b-4 bg-white border-gray-900 rounded dark:bg-gray-900 dark:text-gray-100 w-full justify-between">
              <textarea
                value={oracleInputText}
                onChange={handleUserInput}
                className="w-full bg-transparent dark:placeholder:text-gray-100 focus:border-none focus:outline-none resize-none overflow-hidden"
                placeholder="Type your message..."
                disabled={isOracleLoading}
                rows={3} // Initial row size
                style={{ minHeight: '50px', height: 'auto' }}
              ></textarea>
              <Button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                buttonText={isOracleLoading ? 'Sending...' : 'Send'}
              /></div>
          </form>
        </div>
        <div className="flex w-1/2 flex-col border-2 border-b-4 border-black dark:bg-lime-600 p-2 gap-2">
          <div className="flex gap-2 text-lg font-bold">
            <h3 className="">Trenches Agent - </h3>
            <h4 className="underline">{defineAgentCreationMessage(trenchUser.posts?.length!)}</h4>
          </div>
          {trenchUser.ai_agent?.agent_name && (
            <div className="flex flex-col gap-4">
              <div className="p-2 border-2 border-black dark:bg-gray-900 flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="flex w-full gap-2 border-r-2 border-black pr-2">
                    <div className="w-44 h-32">
                      <img className="h-full" src="/images/pixel_anon74.png" alt="" />
                    </div>
                    <div className="flex flex-col justify-between gap-2 w-full">
                      <div className="flex justify-between">
                        <h3 className="text-xl font-bold">{trenchUser.ai_agent.agent_name || 'no agent'}</h3>

                        <div className="flex gap-2">
                          <div className="flex items-center gap-2">
                            <p>32tc</p>
                            <div className="w-8 h-8 overflow-hidden rounded-full">
                              <img className="w-full h-full" src="/coins/trench_coin_v0.1.webp" alt="" />
                            </div>
                          </div>
                          <Button
                            buttonFunction={handleUpdateUserAgent}
                            type="submit"
                            buttonText={isAgentUpdating ? 'Updating Agent...' : 'Update Agent'}
                            className="mt-2 px-4 py-2 bg-blue-500 border-t-2 border-black text-white rounded disabled:bg-gray-400"
                          />{' '}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex flex-col">
                          <h4 className="text-black font-bold dark:text-white">Updated at:</h4>
                          <h5 className="text-gray-700 dark:text-gray-400">{trenchUser.ai_agent.updated_at}</h5>
                        </div>
                        <div className="flex flex-col">
                          <h4 className="text-xl">Agent address:</h4>
                          <h5 className="text-gray-700 text-sm">{ellipseAddress(trenchUser.ai_agent.agent_wallet_address)}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-1/2 flex flex-col gap-2 relative">
                    <div className="absolute w-full h-full bg-gray-300/60 flex justify-center items-center">
                      <p className="font-bold text-xl">Coming soon!</p>
                    </div>
                    <h3 className="text-xl font-bold">Agent funds:</h3>
                    <div className="h-full grid grid-cols-4 gap-2">
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

          {!activeAccount && (
            <div className="flex flex-col gap-4 p-4 border-2 border-black bg-gray-100">
              <div className="flex gap-2 border-b-2 border-black pb-2">
                <div className="w-20 h-20 flex items-center justify-center bg-gray-200 border-black border-2">
                  <p className="text-xl text-black ">
                    <FaWallet />
                  </p>
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl font-bold">Connect Your Wallet</h3>
                  <p className="text-gray-600 ">Access the trenches by linking your Algorand wallet.</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  pinging={true}
                  type="button"
                  buttonText="Connect Wallet"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
                  buttonFunction={() => {
                    // Function to trigger wallet connection
                    console.log('Connect Wallet Clicked')
                  }}
                />
              </div>
            </div>
          )}
          {!trenchUser.ai_agent?.agent_name && activeAccount && (
            <div className="flex flex-col gap-4">
              <div className="p-2 border-2 border-black dark:bg-gray-900 flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="flex w-full gap-2 border-r-2 border-black pr-2">
                    <div className="w-44 h-32 flex items-center justify-center bg-gray-200 border border-gray-500">
                      <p className="text-sm text-gray-700">No Agent 🫵</p>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex justify-between">
                        <div className='flex flex-col'>
                          <h3 className="text-xl font-bold">Create Your Agent</h3>
                          <p> The trenches don't know about you</p>
                        </div>

                        <div className="flex gap-2">
                          <div className="flex items-center gap-2">
                            <p>0tc</p>
                            <div className="w-8 h-8 overflow-hidden rounded-full">
                              <img className="w-full h-full" src="/coins/trench_coin_v0.1.webp" alt="Trench Coin" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleCreateUserAgent} className="flex flex-col gap-2">
                        <input
                          onChange={handleUserAgentInput}
                          className="w-full bg-transparent dark:placeholder:text-gray-100 resize-none overflow-hidden border-2 border-b-4 dark:border-white border-black"
                          required
                          maxLength={32}
                          placeholder="What is your agent name?"
                          type="text"
                          disabled={isAgentCreating}
                        />
                        <div className="flex justify-end">
                          <Button
                            pinging={true}
                            type="submit"
                            buttonText={isAgentCreating ? 'Creating Agent...' : 'Create Agent'}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                          />
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="w-1/2 flex flex-col gap-2 relative">
                    <div className="absolute w-full h-full bg-gray-300/60 flex justify-center items-center">
                      <p className="font-bold text-xl">Coming soon!</p>
                    </div>
                    <h3 className="text-xl font-bold">Agent funds:</h3>
                    <div className="h-full grid grid-cols-4 gap-2">
                      {usableAssetsList.map((usableAsset) => (
                        <div className="flex gap-1">
                          <img className="w-6 h-6 rounded-full overflow-hidden" src={usableAsset.image} />
                          <h5>0.0</h5>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-2 border-black">
                  <h3 className="text-sm font-bold absolute px-2">No agent yet - Create one to enter the trenches</h3>
                  <div className="w-96 bg-gray-500 h-5"></div>
                </div>
              </div>
            </div>
          )}
          <div className="w-full">
            <div className="flex flex-col border-2 border-b-4 border-black p-2 dark:bg-lime-600 ">
              <div className="flex gap-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Agent chat
                  <FaBiohazard />
                </h2>
                <h2 className="text-xl font-bold"> - Pay small fee to use the agent</h2>
              </div>
              <div
                className="flex flex-col h-40 overflow-y-auto border-2 border-gray-950 bg-gray-300 dark:bg-gray-900 p-4 mb-4"
                ref={chatContainerRef}
              >
                <div className="flex flex-col gap-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`${message.sender === 'user'
                        ? 'self-end bg-blue-500 text-white rounded-br-none'
                        : 'self-start bg-lime-500 rounded-bl-none'
                        } rounded-lg p-3 max-w-[80%]`}
                    >
                      <p className="text-sm font-bold">{message.sender === 'user' ? 'You' : 'Oracle'}</p>
                      <p>{message.sender === 'user' ? 'I want this!' : 'Coming soon BRO'}</p>
                    </div>
                  ))}
                </div>
              </div>
              <form onSubmit={handleAskOracle} className="flex gap-2">
                <input
                  value="Coming soon! Agent chat"
                  className="flex-1 p-2 border-2 text-gray-300 border-gray-300 rounded dark:bg-gray-800 dark:text-gray-600"
                  placeholder="Type your message..."
                  type="text"
                  disabled={isOracleLoading}
                />
                <Button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                  buttonText="Can't wait, huh?"
                  inactive
                />
              </form>
            </div>
          </div>
        </div>
      </div>
      <TrenchAgentsList />
      <Footer />
    </div>
  )
}
