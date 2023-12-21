import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { LikesModule } from './likes/likes.module';
import { RepliesModule } from './replies/replies.module';

@Module({
  imports: [PostsModule, UserModule, PostModule, LikesModule, RepliesModule],
})
export class AppModule {}
