import { Algodv2 } from 'algosdk'

export const getOptedIn = async (walletAddress: string, assetId: number, algod: Algodv2) => {
  try {
    // Fetch account information
    const accountInfo = await algod.accountInformation(walletAddress).do()

    console.log('accountInfo', accountInfo)

    // Check if assetId exists in the account's assets
    const optedIn = accountInfo.assets.some((asset: any) => asset['asset-id'] === assetId)

    return optedIn
  } catch (error) {
    console.error('Error fetching account information:', error)
    return false // Return false if an error occurs or asset not found
  }
}
