interface FeaturedSectionProps {
  sectionTitle: string
  content: any[]
}

export default function FeaturedSection({ sectionTitle, content }: FeaturedSectionProps) {
  return (
    <div className="px-2 h-1/3">
      <h2 className="font-bold text-xl">{sectionTitle}</h2>
      <div className="overflow-y-scroll overflow-x-hidden no-scrollbar h-full p-1">{content}</div>
    </div>
  )
}
