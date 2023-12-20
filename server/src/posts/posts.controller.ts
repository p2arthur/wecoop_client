import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('/posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async getAllPosts() {
    const response = await this.postsService.getAllPosts();

    console.log('Eu sou um console.log');

    return response;
  }

  @Get('/:walletAddress')
  async getAllPostsByAddress(@Param('walletAddress') walletAddress: string) {
    const response =
      await this.postsService.getAllPostsByAddress(walletAddress);
    return response;
  }
}
