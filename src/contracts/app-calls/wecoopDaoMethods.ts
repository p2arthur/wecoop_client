import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import algosdk, { AlgodTokenHeader } from 'algosdk'
import { getAlgodConfigFromViteEnvironment } from '../../utils/network/getAlgoClientConfigs'
import { WecoopDaoClient } from '../clients/WecoopDaoClient'

const algodServer = getAlgodConfigFromViteEnvironment().server
const algodToken = getAlgodConfigFromViteEnvironment().token
const algodPort = getAlgodConfigFromViteEnvironment().port

const algod = new algosdk.Algodv2(algodToken as AlgodTokenHeader, algodServer, algodPort)

export const createAppClient = (account: TransactionSignerAccount) => {
  const appClient = new WecoopDaoClient(
    {
      sender: account,
      resolveBy: 'id',
      id: 722530832,
    },

    algod,
  )

  console.log('WecoopDao Client', appClient)

  return appClient
}
