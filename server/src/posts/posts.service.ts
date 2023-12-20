import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as base64 from 'base-64';
import { WalletAddress } from 'src/enums/WalletAddress';
import { NotePrefix } from 'src/enums/NotePrefix';
import { AssetId } from 'src/enums/AssetId';
import { Fee } from 'src/enums/Fee';

@Injectable()
export class PostsService {
  //----------------------------------------------------------------------------
  //Setting the prefix of this Class - Posts
  private notePrefix: string = NotePrefix.WeCoopPost;

  //Setting the postsList when this Class is created and setting it to an empty array of Posts
  private postsList: any[] = [];
  //----------------------------------------------------------------------------

  //Method to reset set indexer url based on a given address
  private setGetPostsUrl(address: string) {
    return `https://mainnet-idx.algonode.cloud/v2/accounts/${address}/transactions?note-prefix=${base64.encode(
      this.notePrefix,
    )}&tx-type=axfer&asset-id=${AssetId.coopCoin}&currency-greater-than=${
      Fee.postFee - 1
    }&currency-less-than=${Fee.postFee + 1}`;
  }

  //Method to reset postsList propertie of this class
  private resetPostsList() {
    this.postsList = [];
  }

  //Method to get all posts sent to the platform
  //----------------------------------------------------------------------------
  public async getAllPosts() {
    this.resetPostsList();
    const url = this.setGetPostsUrl(WalletAddress.WeCoopMainAddres);
    const { data } = await axios.get(url);
    const { transactions } = data;

    for (let transaction of transactions) {
      const note = base64.decode(transaction.note);
      const postText = note.split(':');

      this.postsList.push({ text: postText[3] });
    }

    return this.postsList;
  }
  //----------------------------------------------------------------------------

  //Method to get all posts using a given address
  //----------------------------------------------------------------------------
  public async getAllPostsByAddress(walletAddres: string) {
    this.resetPostsList();
    const url = this.setGetPostsUrl(walletAddres);
    const { data } = await axios.get(url);
    const { transactions } = data;
    for (let transaction of transactions) {
      const note = base64.decode(transaction.note);
      const postText = note.split(':');

      this.postsList.push({ text: postText[3] });
    }

    return this.postsList;
  }
}
