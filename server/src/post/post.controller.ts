import { Controller, Get, Param } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private postServices: PostService) {}

  @Get('/:postTransactionId')
  getPostByTransactionId(
    @Param('postTransactionId') postTransactionId: string,
  ) {}
}
