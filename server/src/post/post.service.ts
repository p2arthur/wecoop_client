import { Injectable } from '@nestjs/common';
import base64 from 'base-64';
import { PostInterface } from 'src/interfaces/PostInterface';
import { LikesService } from 'src/likes/likes.service';

@Injectable()
export class PostService {
  public post: PostInterface = {
    text: '',
    creator_address: '',
    transaction_id: null,
    timestamp: null,
    country: null,
    likes: [],
    replies: [],
  };

  public async setPost(transaction: any) {
    const encodedNote = transaction.note;
    const decodedNote = atob(encodedNote);
    const postData = decodedNote.split(':');
    const postCountry = postData[2];
    const postText = postData[3];
    const creatorAddress = transaction.sender;
    const transactionId = transaction.id;
    const timestamp = transaction['confirmed-round'];

    this.post = {
      text: postText,
      creator_address: creatorAddress,
      transaction_id: transactionId,
      timestamp,
      country: postCountry,
      likes: 0,
      replies: [],
    };

    return this.post;
  }
}
