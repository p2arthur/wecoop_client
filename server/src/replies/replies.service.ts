import { Injectable } from '@nestjs/common';
import { PostInterface } from 'src/interfaces/PostInterface';
import { LikesService } from 'src/likes/likes.service';

@Injectable()
export class RepliesService {
  public replies: PostInterface[] = [];

  constructor(private likesService: LikesService) {}

  public filterRepliesByPostTransactionId(
    postTransactionId: string,
    repliesList: any,
    likesList: any,
  ): PostInterface[] {
    const mappedReplies = repliesList.transactions
      .filter((reply) => atob(reply.note).split(':')[3] === postTransactionId)
      .map((filteredReply) => {
        const postText = atob(filteredReply.note).split(':')[4];
        const creatorAddress = filteredReply.sender;
        const transactionId = filteredReply.id;
        const timestamp = filteredReply['round-time'];
        const country = filteredReply.country;
        const replyLikes = this.likesService.filterLikesByPostTransactionId(
          transactionId,
          likesList,
        );

        return {
          text: postText,
          creator_address: creatorAddress,
          transaction_id: transactionId,
          timestamp,
          country,
          likes: replyLikes,
          replies: [],
        };
      });

    this.replies = mappedReplies;
    return this.replies;
  }
}
