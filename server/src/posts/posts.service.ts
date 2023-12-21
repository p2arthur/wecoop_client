import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as base64 from 'base-64';
import { WalletAddress } from 'src/enums/WalletAddress';
import { NotePrefix } from 'src/enums/NotePrefix';
import { AssetId } from 'src/enums/AssetId';
import { Fee } from 'src/enums/Fee';
import { PostInterface } from 'src/interfaces/PostInterface';
import { PostService } from 'src/post/post.service';
import { LikesService } from 'src/likes/likes.service';

@Injectable()
export class PostsService {
  //----------------------------------------------------------------------------
  //Setting the prefix of this Class - Posts
  private notePrefix: string = NotePrefix.WeCoopPost;

  //Setting the postsList when this Class is created and setting it to an empty array of Posts
  private postsList: PostInterface[] = [];
  //----------------------------------------------------------------------------

  constructor(
    private postServices: PostService,
    private likesServices: LikesService,
  ) {}

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

    //TODO - Move likes logic to its own service - This is testing
    const likesUrl = `https://mainnet-idx.algonode.cloud/v2/accounts/DZ6ZKA6STPVTPCTGN2DO5J5NUYEETWOIB7XVPSJ4F3N2QZQTNS3Q7VIXCM/transactions?note-prefix=d2Vjb29wLXYxOmxpa2U6&tx-type=axfer`;

    const allLikes = (await axios.get(likesUrl)).data as any;

    const url = this.setGetPostsUrl(WalletAddress.WeCoopMainAddres);
    const { data } = await axios.get(url);
    const { transactions } = data;

    for (let transaction of transactions) {
      const post = await this.postServices.setPost(transaction);

      this.postsList.push(post);
    }

    return this.postsList;
  }
  //----------------------------------------------------------------------------

  //Method to get all posts using a given address
  //----------------------------------------------------------------------------
  public async getAllPostsByAddress(walletAddres: string) {
    const url = this.setGetPostsUrl(walletAddres);
    const { data } = await axios.get(url);
    const { transactions } = data;

    for (let transaction of transactions) {
      const post = await this.postServices.setPost(transaction);

      this.postsList.push(post);
    }

    return this.postsList;
  }
}
