import { Algodv2 } from 'algosdk'

export async function getRoundTimestamp(algodClient: Algodv2, roundNumber: number) {
  try {
    // Fetch the block information for the specified round
    const blockInfo = await algodClient.block(roundNumber).do()

    // Get the timestamp from the block
    let timestamp = blockInfo.block.ts

    if (timestamp && !isNaN(timestamp)) {
      // Convert to a readable date (multiply by 1000 to convert to milliseconds)

      return timestamp
    } else {
      // Handle the case where the timestamp is invalid
      console.error('Invalid timestamp received from the blockchain')
      console.log('Using fallback date: N/A')
    }
  } catch (error) {
    console.error('Error fetching block timestamp:', error)
  }
}
