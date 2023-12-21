import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { LikesService } from '../likes/likes.service';

@Module({
  controllers: [PostController],
  providers: [PostService, LikesService],
})
export class PostModule {}
