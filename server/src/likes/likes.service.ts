import { Injectable } from '@nestjs/common';
import axios from 'axios';
import base64 from 'base-64';
import { NotePrefix } from 'src/enums/NotePrefix';

@Injectable()
export class LikesService {
  public likesList: any[];

  public filterLikesByPostTransactionId(
    postTransactionId: string,
    likesList: any,
  ) {
    return likesList.transactions.filter(
      (like) => atob(like.note).split(':')[3] == postTransactionId,
    );
  }
}
