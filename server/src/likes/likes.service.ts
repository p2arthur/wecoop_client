import { Injectable } from '@nestjs/common';
import axios from 'axios';
import base64 from 'base-64';
import { NotePrefix } from 'src/enums/NotePrefix';

@Injectable()
export class LikesService {
  public likesList: any[];

  public async getLikesByPostTransactionId(
    postTransactionId: string,
    country: string,
  ) {
    const prefix = NotePrefix.WeCoopLike + country + ':' + postTransactionId;

    const { data } = await axios.get(
      `https://mainnet-idx.algonode.cloud/v2/accounts/DZ6ZKA6STPVTPCTGN2DO5J5NUYEETWOIB7XVPSJ4F3N2QZQTNS3Q7VIXCM/transactions?note-prefix=${btoa(
        prefix,
      )}`,
    );

    const allLikes = data.transactions;

    this.likesList = allLikes;

    return this.likesList;
  }

  public filterLikesByPostTransactionId(
    postTransactionId: string,
    likesList: any[],
  ) {}
}
