import axios from 'axios'
import { createContext, useContext, useMemo, useState } from 'react'

interface ITrenchesContext {
  trenchOracleState: { text: string }
  makeRagQuery: (prompt: string) => void
  createUserAgent: (walletAddress: string, agentName: string) => void
}

interface ITrenchesProviderProps {
  children: JSX.Element | JSX.Element[]
}

const TrenchesContext = createContext<ITrenchesContext>({} as ITrenchesContext)

const TrenchesProvider = ({ children }: ITrenchesProviderProps) => {
  const [trenchUser, setTrenchUser] = useState({}) // Replace with your initial state
  const [trenchOracleState, setOracleState] = useState({ text: "I will tell you all about the trenches" })

  const createUserAgent = async (walletAddress: string, agentName: string) => {
    const { data } = await axios.post('http://localhost:5000/create-user-agent', { wallet_address: walletAddress, agent_name: agentName })
    console.log('created', data)
  }

  const makeRagQuery = async (prompt: string) => {
    const { data } = await axios.get(`http://localhost:5000/?question=${prompt}`)
    console.log('data', data)
    setOracleState({
      text: data.trenches_oracle
    })
  }

  const contextValue = useMemo(() => {
    return {
      state: trenchUser,
      trenchOracleState: trenchOracleState,
      makeRagQuery: makeRagQuery,
      createUserAgent: createUserAgent,
    }
  }, [trenchUser, trenchOracleState])

  return <TrenchesContext.Provider value={contextValue}>{children}</TrenchesContext.Provider>
}

const useTrenches = () => useContext(TrenchesContext)

export { TrenchesProvider, useTrenches }

