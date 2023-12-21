import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AssetId } from 'src/enums/AssetId';
import { UserInterface } from 'src/interfaces/UserInterface';
import { UserNfdInterface } from 'src/interfaces/UserNfd';
// import { minidenticon } from 'minidenticons';

@Injectable()
export class UserService {
  public userData: UserInterface = {
    address: '',
    avatar: '',
    nfd: { name: '', avatar: '' },
    balance: 0,
  };
  //----------------------------------------------------------------------------
  private resetUserData() {
    this.userData = {
      address: '',
      avatar: '',
      nfd: { name: '', avatar: '' },
      balance: 0,
    };
  }

  //----------------------------------------------------------------------------
  private setUserData({ address, avatar, nfd, balance }: UserInterface) {
    const user = { address, avatar, nfd, balance };

    this.userData = user;

    return this.userData;
  }

  private async getUserBalance(walletAddres: string) {
    try {
      const { data } = await axios.get(
        `https://mainnet-idx.algonode.cloud/v2/accounts/${walletAddres}/assets?asset-id=${AssetId.coopCoin}&include-all=false`,
      );
      return parseFloat((data.assets[0].amount / 10 ** 6).toFixed(2));
    } catch (error) {
      return 0;
    }
  }
  //----------------------------------------------------------------------------

  //----------------------------------------------------------------------------
  public async getUserData(walletAddres: string) {
    const userBalance = await this.getUserBalance(walletAddres);
    const nfd = await this.getUserNfd(walletAddres);

    const userData: UserInterface = {
      address: walletAddres,
      avatar: nfd.avatar || null,
      nfd: nfd,
      balance: userBalance,
    };

    this.setUserData(userData);

    return this.userData;
  }
  //----------------------------------------------------------------------------

  //----------------------------------------------------------------------------
  private async getUserNfd(walletAddres: string) {
    let userNfd: UserNfdInterface = { name: null, avatar: null };

    try {
      const { data } = await axios.get(
        `https://api.nf.domains/nfd/v2/address?address=${walletAddres}&limit=20&view=thumbnail`,
      );
      const userNfdData = data[walletAddres];
      const nfdName = userNfdData[0].name;
      let nfdAvatar = userNfdData[0].properties.userDefined.avatar;
      userNfd = { name: nfdName, avatar: nfdAvatar || null };

      return userNfd;
    } catch (error) {
      return userNfd;
    }
  }
}
