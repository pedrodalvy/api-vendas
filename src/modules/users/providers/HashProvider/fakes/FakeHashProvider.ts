import { IHashProvider } from '@modules/users/providers/HashProvider/models/IHashProvider';

export class FakeHashProvider implements IHashProvider {
  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return true;
  }

  async generateHash(payload: string): Promise<string> {
    return payload;
  }
}
