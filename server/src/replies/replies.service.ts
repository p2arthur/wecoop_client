import { Injectable } from '@nestjs/common';

@Injectable()
export class RepliesService {
  public replies: { text: string } = { text: '' };

  public filterRepliesByPostTransactionId(
    postTransactionId: string,
    repliesList: any,
  ) {
    console.log(repliesList);

    const mappedReplies = repliesList.transactions
      .filter((reply) => atob(reply.note).split(':')[3] == postTransactionId)
      .map((filteredReply) => {
        return {
          text: atob(filteredReply.note).split(':')[4],
          creator_address: filteredReply.sender,
          transaction_id: filteredReply.id,
          timestamp: filteredReply.timestamp,
        };
      });

    this.replies = mappedReplies;
    return this.replies;
  }
}
