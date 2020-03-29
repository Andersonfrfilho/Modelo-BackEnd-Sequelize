import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../../src/app/models/User';

factory.define('User', User, {
  name: faker.name.firstName().toLocaleLowerCase(),
  email: faker.internet.email().toLocaleLowerCase(),
  password: faker.internet.password().toLocaleLowerCase(),
  phone: faker.phone.phoneNumber().toLocaleLowerCase(),
  type: faker.name.jobType().toLocaleLowerCase(),
});
export default factory;
