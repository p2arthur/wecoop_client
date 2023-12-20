import axios from 'axios'

export const getUserCountry = async () => {
  const { data } = await axios.get('https://api.country.is/')
  const { country } = data
  return country
}
