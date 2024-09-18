interface FeaturedSectionProps {
  sectionTitle: string
  content: any[]
  isLoadingAnalytics: boolean
}

export default function FeaturedSection({ sectionTitle, content, isLoadingAnalytics }: FeaturedSectionProps) {
  return (
    <div className="px-2 h-1/3">
      <h2 className="font-bold text-xl">{sectionTitle}</h2>
      {isLoadingAnalytics ? (
        <div className={'h-full flex items-center justify-center'}>
          <img className={'dark:hidden'} src={'/images/topcreators_light.gif'} alt={'top creators loading'} />
          <img className={'hidden dark:block'} src={'/images/topcreators_dark.gif'} alt={'top creators loading'} />
        </div>
      ) : (
        <div className="overflow-y-scroll overflow-x-hidden no-scrollbar h-full p-1">{content}</div>
      )}
    </div>
  )
}
