import axios from 'axios'
import { createContext, useContext, useMemo, useState } from 'react'
import { Post } from '../../services/api/types'

type allAnalyticsType = { topCreators: string[]; topPosts: Post[] }

type IAnalyticsContext = {
  allAnalytics: allAnalyticsType
  getAllAnalytics: () => Promise<void>
  isLoadingAnalytics: boolean
}

interface IAnalyticsProviderProps {
  children: JSX.Element | JSX.Element[]
}

const AnalyticsContext = createContext<IAnalyticsContext>({
  allAnalytics: { topCreators: [], topPosts: [] },
  getAllAnalytics: async () => {},
  isLoadingAnalytics: false,
})

const AnalyticsProvider = ({ children }: IAnalyticsProviderProps) => {
  const [allAnalytics, setAllAnalytics] = useState<allAnalyticsType>({ topCreators: [], topPosts: [] })
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState<boolean>(false)

  const getAllAnalytics = async () => {
    const savedPosts: Post[] = JSON.parse(sessionStorage.getItem('postList')!)

    if (!savedPosts) return

    try {
      setIsLoadingAnalytics(true)
      // Get creators analytics
      const { data: topCreatorsData } = await axios.get(`${import.meta.env.VITE_WECOOP_API}/analytics/creators/top-liked-creators`)

      // Get posts analytics with type assertion for expected structure
      const { data: topPostsData } = await axios.get<{ postId: string; likesCount: number }[]>(
        `${import.meta.env.VITE_WECOOP_API}/analytics/posts/top-liked-posts`,
      )

      // Map over the data to extract postIds
      const topPosts: Post[] = []

      topPostsData.forEach((postAnalytic) => {
        savedPosts.forEach((post) => {
          if (post.transaction_id == postAnalytic.postId) {
            topPosts.push({ ...post, text: post.text })
          }
        })
      })

      // Set analytics data in state
      setAllAnalytics({ topCreators: topCreatorsData, topPosts })
      setIsLoadingAnalytics(false)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)

      setIsLoadingAnalytics(false)
    }
  }
  const analyticsValues = useMemo(
    () => ({
      allAnalytics,
      getAllAnalytics,
      isLoadingAnalytics,
    }),
    [allAnalytics, getAllAnalytics, isLoadingAnalytics],
  )

  return <AnalyticsContext.Provider value={analyticsValues}>{children}</AnalyticsContext.Provider>
}

const useAnalytics = () => {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}

export { AnalyticsProvider, useAnalytics }
