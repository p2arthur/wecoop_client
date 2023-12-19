export interface GetAllPostsResponse {
  'current-round': number
  'next-token': string
  transactions: Transaction[]
}

export interface Transaction {
  'asset-transfer-transaction': AssetTransferTransaction
  'close-rewards': number
  'closing-amount': number
  'confirmed-round': number
  fee: number
  'first-valid': number
  'genesis-hash': string
  'genesis-id': string
  id: string
  'intra-round-offset': number
  'last-valid': number
  note: string
  'receiver-rewards': number
  'round-time': number
  sender: string
  'sender-rewards': number
  signature: Signature
  'tx-type': string
  group?: string
  'auth-addr'?: string
}

export interface AssetTransferTransaction {
  amount: number
  'asset-id': number
  'close-amount': number
  receiver: string
}

export interface Signature {
  sig: string
}
