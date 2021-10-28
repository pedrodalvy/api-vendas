import { ICustomer } from '@modules/customers/domain/models/ICustomer';

export function makeAValidCustomerMock(): ICustomer {
  return {
    id: '5baea1f3-8cd1-4bce-817b-ad36ed4dd386',
    name: 'Valid Name',
    email: 'valid@email.com',
    created_at: new Date(),
    updated_at: new Date(),
  };
}
