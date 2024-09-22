import { useGetTopInteractionsByWallet, useGetTopPostsByLike } from '../../services/api/Analytics'
import { User as UserInterface } from '../../services/api/types'
import FeaturedSection from '../featured-section/FeaturedSection'
import TopCreatorCard from '../featured-section/TopCreatorCard'
import TopPostCard from '../featured-section/TopPostCard'

interface ProfileMenuProps {
  user: UserInterface
}

export const ProfileMenu = () => {
  const { data, isLoading } = useGetTopInteractionsByWallet()
  const { data: dataTopPosts, isLoading: isLoadingTopPosts } = useGetTopPostsByLike()

  return (
    <div className={'w-full p-4 h-full flex flex-col justify-between'}>
      <FeaturedSection
        sectionTitle="Top posts"
        isLoadingAnalytics={isLoadingTopPosts}
        content={<div className="flex flex-col gap-2">{dataTopPosts?.map((post) => <TopPostCard post={post} />)}</div>}
      />

      <FeaturedSection
        sectionTitle="Top creators by interactions"
        isLoadingAnalytics={isLoading}
        content={<div className="flex flex-col gap-2">{data && data.map((creator) => <TopCreatorCard topCreator={creator} />)}</div>}
      />

      <div className="w-full text-center flex flex-col gap-2">
        <div>
          Made by{' '}
          <a className="underline text-blue-700 hover:text-blue-500" target="_blank" href="https://twitter.com/iam_p2">
            @iam_p2
          </a>{' '}
          /{' '}
          <a className="underline text-blue-700 hover:text-blue-500" target="_blank" href="https://github.com/FelipeQueiroz">
            Felipe
          </a>{' '}
          /{' '}
          <a className="underline text-blue-700 hover:text-blue-500" target="_blank" href="https://www.linkedin.com/feed/">
            D2dods
          </a>
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
