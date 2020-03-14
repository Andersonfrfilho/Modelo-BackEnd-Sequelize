import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';
import truncate from '../util/truncate';
import { userFactory } from '../factory';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should be able to register', async () => {
    const user = await userFactory.attrs('User');
    const response = await request(app)
      .post('/users')
      .send(user);
    expect(response.body).toHaveProperty('id');
  });
  it('should not be able to register with duplicate email', async () => {
    const user = await userFactory.attrs('User');
    await request(app)
      .post('/users')
      .send(user);
    const response = await request(app)
      .post('/users')
      .send(user);
    expect(response.status).toBe(400);
  });
  it('should encrypt user password when new user created', async () => {
    const user = await userFactory.create('User', {
      password: '123',
    });
    const compareHash = await bcrypt.compare('123', user.password_hash);
    expect(compareHash).toBe(true);
  });
});
