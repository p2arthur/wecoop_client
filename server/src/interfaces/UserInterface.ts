import { UserNfdInterface } from './UserNfd';

export interface UserInterface {
  address: string;
  avatar?: string | undefined;
  nfd?: UserNfdInterface;
  balance?: number;
}
