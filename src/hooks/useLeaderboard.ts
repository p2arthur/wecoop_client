import { Like, Post } from '../services/api/types'
import { useMemo } from 'react'

const useLeaderboard = (postList: Post[] | null) => {
  const leaderboardData = useMemo(() => {
    if (!postList) return { topPosts: [], topUsers: [], totalInteractions: 0 }

    // Calculate total interactions (post + replies + likes)
    let totalInteractions = 0

    postList.forEach((post) => {
      totalInteractions += 1 // Each post counts as 1 interaction
      totalInteractions += post.replies?.length || 0 // Each reply is another interaction
      totalInteractions += post.likes?.length || 0 // Each like is another interaction
    })

    // Calculate top 10 posts by likes
    const topPosts = [...postList]
      .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
      .slice(0, 10)
      .map((post) => ({
        id: post.transaction_id,
        text: post.text,
        likesCount: post.likes?.length || 0,
        repliesCount: post.replies?.length || 0,
        assetId: post.assetId,
      }))

    // Create a map to store user interactions
    const userInteractions: Record<string, number> = {}

    postList.forEach((post) => {
      // Increment the post creator's interaction count
      userInteractions[post.creator_address] = (userInteractions[post.creator_address] || 0) + 1

      // Increment the count for each user who liked the post
      post.likes?.forEach((like: Like) => {
        userInteractions[like.creator_address] = (userInteractions[like.creator_address] || 0) + 1
      })

      // Increment the count for each user who replied to the post
      post.replies?.forEach((reply) => {
        userInteractions[reply.creator_address] = (userInteractions[reply.creator_address] || 0) + 1
      })
    })

    // Convert the interaction data to an array and sort by interaction count
    const topUsers = Object.entries(userInteractions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([creator_address, count]) => ({ creator_address, interactions: count }))

    return { topPosts, topUsers, totalInteractions }
  }, [postList])

  return leaderboardData
}

export default useLeaderboard
