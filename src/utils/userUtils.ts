import axios from 'axios'

export const getUserCountry = async () => {
  const { data } = await axios.get(`https://api.ipdata.co?api-key=${import.meta.env.VITE_COUNTRY_API}`)
  const { country_code } = data
  return country_code
}
