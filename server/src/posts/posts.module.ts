import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostService } from 'src/post/post.service';
import { LikesService } from 'src/likes/likes.service';
import { RepliesService } from 'src/replies/replies.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostService, LikesService, RepliesService],
})
export class PostsModule {}
