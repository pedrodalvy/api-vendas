import { IUser } from '@modules/users/domain/models/IUser';

export function makeAValidUserMock(): IUser {
  return {
    id: '5baea1f3-8cd1-4bce-817b-ad36ed4dd386',
    name: 'Valid Name',
    email: 'valid@email.com',
    avatar: 'file_path',
    password: 'hashed_password',
    created_at: new Date(),
    updated_at: new Date(),

    getAvatarUrl(): string | null {
      return null;
    },
  };
}
