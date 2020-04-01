import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../../src/app/models/User';

factory.define('User', User, {
  name: faker.name.firstName,
  email: faker.internet.email,
  password: faker.internet.password,
  phone: faker.phone.phoneNumber,
  type: faker.name.jobType,
});
export default factory;
