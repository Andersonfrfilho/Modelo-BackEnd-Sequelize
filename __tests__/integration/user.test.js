import request from 'supertest';
import bcrypt from 'bcryptjs';
import { object } from 'yup';
import app from '../../src/app';
import truncate from '../util/truncate';
import { userFactory, fileFactory } from '../factory';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('1.  - should be able to register user', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      avatar_id: logoId,
      confirmPassword: attributes.password,
    };
    const { body: responseUser } = await request(app)
      .post('/users')
      .send(newUser);
    expect(responseUser).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        avatar_id: expect.any(Number),
      })
    );
  });
  it('1.1   - should not be able to register user without fields valids', async () => {
    const responseUser = await request(app)
      .post('/users')
      .send();
    expect(responseUser.status).toEqual(400);
  });
  it('1.1.1 - should not be able to register user without fields valids specified (name)', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      name: null,
      confirmPassword: attributes.password,
      avatar_id: logoId,
    };
    const responseUser = await request(app)
      .post('/users')
      .send(newUser);
    expect(responseUser.status).toEqual(400);
  });
  it('1.1.2 - should not be able to register user without fields valids specified (email)', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      email: null,
      confirmPassword: attributes.password,
      avatar_id: logoId,
    };
    const responseUser = await request(app)
      .post('/users')
      .send(newUser);
    expect(responseUser.status).toEqual(400);
  });
  it('1.1.3 - should not be able to register user without fields valids specified (phone)', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      phone: null,
      avatar_id: logoId,
      confirmPassword: attributes.password,
    };
    const responseUser = await request(app)
      .post('/users')
      .send(newUser);
    expect(responseUser.status).toEqual(400);
  });
  it('1.1.4 - should not be able to register user without fields valids specified (password)', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      password: null,
      avatar_id: logoId,
    };
    const responseUser = await request(app)
      .post('/users')
      .send(newUser);
    expect(responseUser.status).toEqual(400);
  });
  it('1.1.5 - should not be able to register user without fields valids specified (type)', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      type: null,
      confirmPassword: attributes.password,
      avatar_id: logoId,
    };
    const responseUser = await request(app)
      .post('/users')
      .send(newUser);
    expect(responseUser.status).toEqual(400);
  });
  it('1.2 - The user can register with a non-existent image but it will have the value of null or inexistent', async () => {
    const logoId = 20;
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      confirmPassword: attributes.password,
      avatar_id: logoId,
    };
    const { body: responseUser } = await request(app)
      .post('/users')
      .send(newUser);
    expect(responseUser).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        avatar_id: expect.any(Object),
      })
    );
  });
  it('1.3 - The user can register with a non-existent image but it will have the value of null or inexistent', async () => {
    const logoId = 20;
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      confirmPassword: attributes.password,
      avatar_id: logoId,
    };
    const { body: responseUser } = await request(app)
      .post('/users')
      .send(newUser);
    expect(responseUser).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        avatar_id: expect.any(Object),
      })
    );
  });
  it('2.  - The user can list the all user register with pages', async () => {
    await userFactory.createMany('User', 20);
    const { body: responseUser } = await request(app).get('/users');
    expect(responseUser).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          phone: expect.any(String),
          avatar_id: expect.any(Object),
        }),
      ])
    );
  });
  it('3. - The user can list the especified user register with', async () => {
    const { id } = await userFactory.create('User');
    const { body: responseUser } = await request(app).get('/users/:id');
    expect(responseUser).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        avatar_id: expect.any(Object),
      })
    );
  });
});
