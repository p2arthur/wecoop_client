import { useWallet } from '@txnlab/use-wallet'
import axios from 'axios'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Message } from '../../pages/TheTrenches'
import { PostCreateMongo } from '../../services/api/types'

interface ITrenchesContext {
  trenchOracleState: { text: string }
  trenchUser: ITrenchUser
  makeRagQuery: (prompt: string, chat_history: Message[]) => Promise<void>
  createUserAgent: (walletAddress: string, agentName: string) => Promise<void>
  appendUserTrenchesData: (walletAddress: string | null) => Promise<void>
  getUserAgent: (walletAddress: string) => Promise<void>
}

interface ITrenchesProviderProps {
  children: JSX.Element | JSX.Element[]
}

interface ITrenchUser {
  walletAddress: string | null
  posts: PostCreateMongo[] | null
  ai_agent: IAIUserAgent | null
}

interface IAIUserAgent {
  _id: string,
  agent_name: string,
  agent_wallet_address: string,
  created_at: string,
  updated_at: string,
  user_wallet_address: string
}

const TrenchesContext = createContext<ITrenchesContext>({} as ITrenchesContext)

const TrenchesProvider = ({ children }: ITrenchesProviderProps) => {
  const [trenchUser, setTrenchUser] = useState<ITrenchUser>({ walletAddress: null, posts: null, ai_agent: null }) // Replace with your initial state
  const [trenchOracleState, setOracleState] = useState({ text: 'I will tell you all about the trenches' })
  const { activeAccount } = useWallet()

  const createUserAgent = async (walletAddress: string, agentName: string) => {
    try {
      const { data: response_ai_server } = await axios.post(`${import.meta.env.VITE_APP_AI_API}/create-user-agent`, {
        wallet_address: walletAddress,
        agent_name: agentName,
      })
      // const { data: response_mongodb } = await axios.post(`${import.meta.env.VITE_WECOOP_API}/ai-agents/create-user-agent`, {
      //   wallet_address: walletAddress,
      //   agent_name: agentName,
      // })

      // console.log('Response:', response_mongodb.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error:', error.response?.data || error.message)
      } else {
        console.error('Error:', error)
      }
    }
  }

  const makeRagQuery = async (prompt: string, chat_history: Message[]) => {
    const { data } = await axios.post(`${import.meta.env.VITE_APP_AI_API}/ask-oracle`, { question: prompt, chat_history: chat_history })
    console.log('data', data)
    setOracleState({
      text: data.trenches_oracle,
    })
  }

  const getUserPosts = async (walletAddress: String) => {
    const { data } = await axios.get(`${import.meta.env.VITE_WECOOP_API}/ai-agents/user-posts/${walletAddress}`)
    return data
  }

  const appendUserTrenchesData = async (walletAddress: string | null) => {
    if (!walletAddress) {
      setTrenchUser({ walletAddress: null, posts: null, ai_agent: null })
      return
    }
    const userPosts = await getUserPosts(walletAddress)
    const userAiAgent = await getUserAgent(walletAddress)
    setTrenchUser({ walletAddress, posts: userPosts, ai_agent: userAiAgent })
  }

  const getUserAgent = async (walletAddress: string) => {
    const { data } = await axios.get(`${import.meta.env.VITE_APP_AI_API}/user-agents/${walletAddress}`)
    return data
  }

  useEffect(() => {
    if (!activeAccount?.address) {
      setTrenchUser({ walletAddress: null, posts: [], ai_agent: null })
      return
    }
    appendUserTrenchesData(activeAccount?.address)
  }, [activeAccount])

  const contextValue = useMemo(() => {
    return {
      state: trenchUser,
      trenchOracleState: trenchOracleState,
      trenchUser: trenchUser,
      makeRagQuery: makeRagQuery,
      createUserAgent: createUserAgent,
      appendUserTrenchesData: appendUserTrenchesData,
      getUserAgent: getUserAgent,
    }
  }, [trenchUser, trenchOracleState])

  return <TrenchesContext.Provider value={contextValue}>{children}</TrenchesContext.Provider>
}

const useTrenches = () => useContext(TrenchesContext)

export { TrenchesProvider, useTrenches }

