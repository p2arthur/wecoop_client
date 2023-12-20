import React, { useEffect, useState } from 'react'

const TypingPlaceholder: React.FC<{ phrases: string[] }> = ({ phrases }) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
    }, 3000) // Change the interval time as needed

    return () => clearInterval(intervalId)
  }, [phrases.length])

  return <span className="inline-block after:content-['|'] after:block after:w-0 animate-typing">{phrases[currentPhraseIndex]}</span>
}

export default TypingPlaceholder
