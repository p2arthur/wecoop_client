import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class UserService {
  public async getUserData() {
    const { data } = await axios.get(
      'https://mainnet-idx.algonode.cloud/v2/accounts/TGIPEOKUFC5JFTPFMXGSZWOGOFA7THFZXUTRLQEOH3RD3LGI6QEEWJNML4',
    );

    return data;
  }
}
