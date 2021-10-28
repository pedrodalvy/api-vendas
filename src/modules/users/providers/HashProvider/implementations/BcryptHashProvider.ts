import { IHashProvider } from '@modules/users/providers/HashProvider/models/IHashProvider';
import { compare, hash } from 'bcryptjs';

export class BcryptHashProvider implements IHashProvider {
  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }

  async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }
}
