const formatDateFromTimestamp = (timestamp: number) => {
  const currentDate = new Date().getTime()
  const inputDate = new Date(timestamp).getTime()

  const differenceInSeconds = Math.floor((currentDate - inputDate) / 1000)

  if (differenceInSeconds < 60) {
    return { time: differenceInSeconds, measure: 'seconds' }
  } else if (differenceInSeconds < 3600) {
    const minutes = Math.floor(differenceInSeconds / 60)
    return { time: minutes, measure: 'minutes' }
  } else if (differenceInSeconds < 86400) {
    const hours = Math.floor(differenceInSeconds / 3600)
    return { time: hours, measure: 'hours' }
  } else {
    const days = Math.floor(differenceInSeconds / 86400)
    return { time: days, measure: 'days' }
  }
}

export default formatDateFromTimestamp
