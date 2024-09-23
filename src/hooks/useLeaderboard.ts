import { Like, Post } from '../services/api/types'
import { useMemo } from 'react'

const useLeaderboard = (postList: Post[] | null, assetIdFilter: number | null | undefined) => {
  const leaderboardData = useMemo(() => {
    if (!postList) return { topPosts: [], topUsers: [], totalInteractions: 0 }

    // Filtro os posts por assetId se assetIdFilter não for null
    const filteredPostList = assetIdFilter ? postList.filter((post) => post.assetId === assetIdFilter) : postList

    // Filtro os posts que tenham pelo menos 1 like ou 1 reply
    const postsWithInteractions = filteredPostList.filter((post) => (post.likes?.length || 0) > 0 || (post.replies?.length || 0) > 0)

    // Calcular interações totais (post + replies + likes)
    let totalInteractions = 0

    postsWithInteractions.forEach((post) => {
      totalInteractions += 1 // Cada post conta como 1 interação
      totalInteractions += post.replies?.length || 0 // Cada reply conta como outra interação
      totalInteractions += post.likes?.length || 0 // Cada like conta como outra interação
    })

    // Calcular os top 10 posts por número de likes
    const topPosts = [...postsWithInteractions]
      .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
      .slice(0, 10)
      .map((post) => ({
        id: post.transaction_id,
        text: post.text,
        likesCount: post.likes?.length || 0,
        repliesCount: post.replies?.length || 0,
        assetId: post.assetId,
      }))

    // Criar um map para armazenar as interações dos usuários
    const userInteractions: Record<string, number> = {}

    postsWithInteractions.forEach((post) => {
      // Incrementar o contador de interações do criador do post
      userInteractions[post.creator_address] = (userInteractions[post.creator_address] || 0) + 1

      // Incrementar o contador para cada usuário que deu like no post
      post.likes?.forEach((like: Like) => {
        userInteractions[like.creator_address] = (userInteractions[like.creator_address] || 0) + 1
      })

      // Incrementar o contador para cada usuário que respondeu ao post
      post.replies?.forEach((reply) => {
        userInteractions[reply.creator_address] = (userInteractions[reply.creator_address] || 0) + 1
      })
    })

    // Converter os dados de interações em um array e ordenar por número de interações
    const topUsers = Object.entries(userInteractions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([creator_address, interactions]) => ({ creator_address, interactions }))

    return { topPosts, topUsers, totalInteractions }
  }, [postList, assetIdFilter])

  return leaderboardData
}

export default useLeaderboard
