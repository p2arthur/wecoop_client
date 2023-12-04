export interface UserInterface {
  address: string
}

export class User {
  constructor(private userData: UserInterface) {}

  async signTransaction() {}
}
