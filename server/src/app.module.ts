import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [PostsModule, UserModule, PostModule, LikesModule],
})
export class AppModule {}
