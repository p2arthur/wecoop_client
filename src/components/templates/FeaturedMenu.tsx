import CountUp from 'react-countup'
import { usePosts } from '../../context/Posts/Posts'
import useLeaderboard from '../../hooks/useLeaderboard'
import FeaturedSection from '../featured-section/FeaturedSection'
import TopCreatorCard from '../featured-section/TopCreatorCard'
import TopPostCard from '../featured-section/TopPostCard'

interface ProfileMenuProps {
  activeAssetId: number | null | undefined
}

export const ProfileMenu = ({ activeAssetId }: ProfileMenuProps) => {
  const { postList, isLoading } = usePosts()
  const { topPosts, topUsers, totalInteractions } = useLeaderboard(postList, activeAssetId)

  const isLoadingTotal = isLoading

  return (
    <div className={'w-full p-4 h-full flex flex-col justify-between'}>
      {!isLoadingTotal && (
        <div className={'text-center'}>
          <h1 className={'text-2xl'}>Total interactions:</h1>
          <CountUp className={'text-xl bold'} end={totalInteractions || 0} />
        </div>
      )}
      <FeaturedSection
        sectionTitle="Top creators "
        isLoadingAnalytics={isLoadingTotal}
        content={
          <div className="flex flex-col gap-2">{topUsers && topUsers.map((creator) => <TopCreatorCard topCreator={creator} />)}</div>
        }
      />
      <FeaturedSection
        sectionTitle="Top posts"
        isLoadingAnalytics={isLoadingTotal}
        content={
          <div className="flex flex-col gap-2 ">
            {topPosts?.map((post) => {
              return <TopPostCard post={post} />
            })}
          </div>
        }
      />

      <div className="w-full text-center flex flex-col gap-2">
        <h1>Made by </h1>
        <div>
          <a className="underline text-blue-700 hover:text-blue-500" target="_blank" href="https://twitter.com/iam_p2">
            @iam_p2
          </a>{' '}
          and{' '}
          <a className="underline text-blue-700 hover:text-blue-500" target="_blank" href="https://github.com/FelipeQueiroz">
            Felipe
          </a>{' '}
        </div>
        <a href="/about">
          <p className="text-blue-700 underline">About the app</p>
        </a>
        <p className="text-xs text-gray-500">$COOP is not responsible for any post created on the platform</p>
        <div className="flex gap-2 items-center justify-center">
          <p>powered by</p>
          <a target="_blank" href="https://www.algorand.foundation/">
            <img className="h-12 dark:hidden" src="/images/algorand_logo.png" alt="algorand-logo" />
            <img className="h-6 hidden dark:flex" src="/images/algorand_logo_white.png" alt="algorand-logo" />
          </a>
        </div>
      </div>
    </div>
  )
}
