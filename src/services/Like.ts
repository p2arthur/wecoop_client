import AlgodClient from "algosdk/dist/types/client/v2/algod/algod";
import { getUserCountry } from "../utils/userUtils";
import { NotePrefix } from "../enums/notePrefix";
import { Transaction } from "./Transaction";
import algosdk from "algosdk";


interface LikeProps {
  event: React.FormEvent,
  creatorAddress: string,
  transactionId: string,
  address: string
}


export class Like {
  constructor(private client: AlgodClient) {
  }

  public async handlePostLike({ event, creatorAddress, transactionId, address }: LikeProps) {

    const transactionService = new Transaction(this.client);

    event.preventDefault();
    const country = await getUserCountry();
    const note = `${NotePrefix.WeCoopLike}${country}:${transactionId}`;
    const scoopFeeTransaction = await transactionService.createTransaction(
      address,
      "GYET4OG2L3PIMYSEJV5GNACHFA6ZHFJXUOM7NFR2CDFWEPS2XJRTS45YMQ",
      1000,
      note
    );
    const postCreatorFee = await transactionService.createTransaction(
      address,
      creatorAddress,
      1000,
      `creator-fee:${note}`
    );

    const transactionsArray = [scoopFeeTransaction, postCreatorFee];
    const groupedTransactions = algosdk.assignGroupID(transactionsArray);
    const encodedGroupedTransactions = groupedTransactions.map((transaction) => algosdk.encodeUnsignedTransaction(transaction));

    return encodedGroupedTransactions;
  }
}
