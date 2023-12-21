import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostService } from 'src/post/post.service';
import { LikesService } from 'src/likes/likes.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostService, LikesService],
})
export class PostsModule {}
