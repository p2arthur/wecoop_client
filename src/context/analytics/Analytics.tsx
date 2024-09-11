import axios from 'axios'
import { createContext, useContext, useState } from 'react'

type allAnalyticsType = { topCreators: string[] }

type IAnalyticsContext = {
  allAnalytics: allAnalyticsType
  getAllAnalytics: () => Promise<void>
}

interface IAnalyticsProviderProps {
  children: JSX.Element | JSX.Element[]
}

const AnalyticsContext = createContext<IAnalyticsContext>({
  allAnalytics: { topCreators: [] },
  getAllAnalytics: async () => {},
})

const AnalyticsProvider = ({ children }: IAnalyticsProviderProps) => {
  const [allAnalytics, setAllAnalytics] = useState<allAnalyticsType>({ topCreators: [] })

  const getAllAnalytics = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_WECOOP_API}/analytics/creators/top-liked-creators`)

      console.log('data', data)

      setAllAnalytics({ topCreators: data })
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  return <AnalyticsContext.Provider value={{ allAnalytics, getAllAnalytics }}>{children}</AnalyticsContext.Provider>
}

const useAnalytics = () => {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}

export { AnalyticsProvider, useAnalytics }
