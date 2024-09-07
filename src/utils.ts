import { formatDistanceToNow } from 'date-fns'

const formatDateFromTimestamp = (timestamp: number) => {
  const inputDate = new Date(timestamp)

  const distance = formatDistanceToNow(inputDate, { addSuffix: true })

  return distance
}
export default formatDateFromTimestamp
