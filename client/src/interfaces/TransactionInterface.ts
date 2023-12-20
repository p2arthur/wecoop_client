export interface AssetTransferTransaction {
  amount: number
  assetId: number
  closeAmount: number
  receiver: string
  closeRewards: number
  closingAmount: number
  confirmedRound: number
  fee: number
  firstValid: number
  genesisHash: string
  genesisId: string
  id: string
  intraRoundOffset: number
  lastValid: number
  note: string
  receiverRewards: number
  roundTime: number
  sender: string
  senderRewards: number
  signature: { sig: string }
  txType: string
}
