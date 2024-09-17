import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const Home = () => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/feed')
  }, [])
  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}
