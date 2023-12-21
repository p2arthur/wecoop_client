import { Module } from '@nestjs/common';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { LikesService } from 'src/likes/likes.service';

@Module({
  controllers: [RepliesController],
  providers: [RepliesService, LikesService],
})
export class RepliesModule {}
