import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PostsService {
  public async getAllPosts() {
    const { data } = await axios.get('');
  }
}
