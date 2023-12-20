import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PostsModule, UserModule],
})
export class AppModule {}
