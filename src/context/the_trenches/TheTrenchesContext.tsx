import { useWallet } from '@txnlab/use-wallet'
import axios from 'axios'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Message } from '../../pages/TheTrenches'
import { PostCreateMongo } from '../../services/api/types'

interface ITrenchesContext {
  trenchOracleState: { text: string }
  trenchUser: ITrenchUser
  createdAgents: IAIUserAgent[]
  isOracleLoading: boolean
  isAgentCreating: boolean
  isAgentUpdating: boolean
  makeRagQuery: (prompt: string, chat_history: Message[]) => Promise<void>
  createUserAgent: (walletAddress: string, agentName: string) => Promise<void>
  appendUserTrenchesData: (walletAddress: string | null) => Promise<void>
  getUserAgent: (walletAddress: string) => Promise<void>
  updateUserAgent: (walletAddress: string) => Promise<void>
  getCreatedAgents: () => Promise<void>
}

interface ITrenchesProviderProps {
  children: JSX.Element | JSX.Element[]
}

interface ITrenchUser {
  walletAddress: string | null
  posts: PostCreateMongo[] | null
  ai_agent: IAIUserAgent | null
}

export interface IAIUserAgent {
  _id: string
  agent_name: string
  agent_wallet_address: string
  created_at: string
  updated_at: string
  user_wallet_address: string
  image_ipfs_hash: string
}

const TrenchesContext = createContext<ITrenchesContext>({} as ITrenchesContext)

const TrenchesProvider = ({ children }: ITrenchesProviderProps) => {
  const [trenchUser, setTrenchUser] = useState<ITrenchUser>({ walletAddress: null, posts: null, ai_agent: null })
  const [trenchOracleState, setOracleState] = useState({ text: 'I will tell you all about the trenches' })
  const [isOracleLoading, setIsOracleLoading] = useState(false)
  const [isAgentCreating, setIsAgentCreating] = useState(false)
  const [isAgentUpdating, setIsAgentUpdating] = useState(false)
  const [createdAgents, setCreatedAgents] = useState<IAIUserAgent[]>([])
  const { activeAccount } = useWallet()



  const makeRagQuery = async (prompt: string, chat_history: Message[]) => {
    try {
      setIsOracleLoading(true)
      const { data } = await axios.post(`${import.meta.env.VITE_APP_AI_API}/ask-oracle`, {
        question: prompt,
        chat_history,
      })
      setOracleState({ text: data.trenches_oracle })
    } catch (error) {
      console.error('Error fetching oracle response:', error)
    } finally {
      setIsOracleLoading(false)
    }
  }

  const getUserPosts = async (walletAddress: string) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_WECOOP_API}/ai-agents/user-posts/${walletAddress}`)
      return data
    } catch (error) {
      console.error('Error fetching user posts:', error)
      return null
    }
  }

  const getUserAgent = async (walletAddress: string): Promise<void> => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_AI_API}/user-agents/${walletAddress}`)
      await getCreatedAgents()
      console.log('User agent:', data)
      setTrenchUser((prev) => ({ ...prev, ai_agent: data }))


    } catch (error) {
      console.error('Error fetching user agent:', error)

    }
  }

  const createUserAgent = async (walletAddress: string, agentName: string) => {
    try {
      setIsAgentCreating(true)
      await axios.post(`${import.meta.env.VITE_APP_AI_API}/create-user-agent`, {
        wallet_address: walletAddress,
        agent_name: agentName,
      }).then(() => {
        getUserAgent(walletAddress).then()
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsAgentCreating(false)
    }
  }

  const getCreatedAgents = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_AI_API}/user-agents`)
      console.log('User agents:', data)
      setCreatedAgents(data)
    } catch (error) {
      console.error('Error fetching user agents:', error)
    }
  }

  const updateUserAgent = async (walletAddress: string) => {
    setIsAgentUpdating(true)
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_AI_API}/user-agents/${walletAddress}/update`,
        { wallet_address: walletAddress },
        { headers: { 'Content-Type': 'application/json' } }
      )
      // ✅ Update local state with the new AI agent
      setTrenchUser((prev) => ({ ...prev, ai_agent: data }))
    } catch (error) {
      console.error('Error updating user agent:', error)
    } finally {
      setIsAgentUpdating(false)
    }
  }

  const appendUserTrenchesData = async (walletAddress: string | null) => {
    if (!walletAddress) {
      setTrenchUser({ walletAddress: null, posts: null, ai_agent: null })
      return
    }
    try {
      const [userPosts, userAiAgent] = await Promise.all([
        getUserPosts(walletAddress),
        getUserAgent(walletAddress),
      ])

    } catch (error) {
      console.error('Error appending user trenches data:', error)
    }
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
      trenchOracleState,
      trenchUser,
      isOracleLoading,
      isAgentCreating,
      isAgentUpdating,
      makeRagQuery,
      createUserAgent,
      appendUserTrenchesData,
      getUserAgent,
      createdAgents,
      getCreatedAgents,
      updateUserAgent,
    }
  }, [trenchUser, trenchOracleState, getCreatedAgents, createdAgents, isOracleLoading, isAgentCreating, isAgentUpdating])

  return <TrenchesContext.Provider value={contextValue}>{children}</TrenchesContext.Provider>
}

const useTrenches = () => useContext(TrenchesContext)

export { TrenchesProvider, useTrenches }
