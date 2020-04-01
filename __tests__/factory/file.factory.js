import faker from 'faker';
import { factory } from 'factory-girl';

import File from '../../src/app/models/File';

factory.define('File', File, {
  url: faker.internet.avatar,
});
export default factory;
