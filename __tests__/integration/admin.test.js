import request from 'supertest';
import bcrypt from 'bcryptjs';
import { object, number } from 'yup';
import app from '../../src/app';
import truncate from '../util/truncate';
import { userFactory, fileFactory } from '../factory';
import Cache from '../../src/lib/Cache';

describe('Admin', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('1.    - Should be able to register user admin if key admin app.', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      avatar_id: logoId,
      confirmPassword: attributes.password,
      auth: process.env.APP_ADMIN,
    };
    const { body: responseUser } = await request(app)
      .post('/users/admins')
      .send(newUser);
    expect(responseUser).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        avatar_id: expect.any(Number),
        type: expect.any(String),
        password: expect.any(String),
      })
    );
  }, 30000);
  it('1.1   - Should not be able to register user without fields valids.', async () => {
    const responseUser = await request(app)
      .post('/users/admins')
      .send();
    expect(responseUser.status).toEqual(400);
  }, 30000);
  it('1.1.1 - Should not be able to register user without fields valids specified (name).', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      name: null,
      auth: process.env.APP_ADMIN,
      confirmPassword: attributes.password,
      avatar_id: logoId,
    };
    const responseUser = await request(app)
      .post('/users/admins')
      .send(newUser);
    expect(responseUser.status).toEqual(400);
  }, 30000);
  it('1.1.2 - Should not be able to register user without fields valids specified (email).', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      email: null,
      confirmPassword: attributes.password,
      avatar_id: logoId,
      auth: process.env.APP_ADMIN,
    };
    const { status: responseUser } = await request(app)
      .post('/users/admins')
      .send(newUser);
    expect(responseUser).toEqual(400);
  }, 30000);
  it('1.1.3 - Should not be able to register user without fields valids specified (phone).', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      phone: null,
      avatar_id: logoId,
      confirmPassword: attributes.password,
      auth: process.env.APP_ADMIN,
    };
    const { status: responseUser } = await request(app)
      .post('/users/admins')
      .send(newUser);
    expect(responseUser).toEqual(400);
  }, 30000);
  it('1.1.4 - Should not be able to register user without fields valids specified (password).', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      password: null,
      avatar_id: logoId,
      auth: process.env.APP_ADMIN,
    };
    const { status: responseUser } = await request(app)
      .post('/users/admins')
      .send(newUser);
    expect(responseUser).toEqual(400);
  }, 30000);
  it('1.1.5 - Should not be able to register user without fields valids specified (auth).', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      auth: null,
      confirmPassword: attributes.password,
      avatar_id: logoId,
    };
    const { status: responseUser } = await request(app)
      .post('/users/admins')
      .send(newUser);
    expect(responseUser).toEqual(400);
  }, 30000);
  it(`1.4   - The user can't do register with email existent.`, async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      avatar_id: logoId,
      confirmPassword: attributes.password,
      auth: process.env.APP_ADMIN,
    };
    const { body: responseUser } = await request(app)
      .post('/users/admins')
      .send(newUser);
    const newAttributes = await userFactory.attrs('User');
    const newUserTwo = {
      ...newAttributes,
      avatar_id: logoId,
      confirmPassword: newAttributes.password,
    };
    const { status: responseUserTwo } = await request(app)
      .post('/users/admins')
      .send({ ...newUserTwo, email: attributes.email });
    expect(responseUser).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        avatar_id: expect.any(Number),
      })
    );
    expect(responseUserTwo).toEqual(400);
  }, 30000);
  it(`1.5   - The user can't do register with phone existent.`, async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      avatar_id: logoId,
      confirmPassword: attributes.password,
      auth: process.env.APP_ADMIN,
    };
    const { body: responseUser } = await request(app)
      .post('/users/admins')
      .send(newUser);
    const newAttributes = await userFactory.attrs('User');
    const newUserTwo = {
      ...newAttributes,
      avatar_id: logoId,
      confirmPassword: newAttributes.password,
    };
    const { status: responseUserTwo } = await request(app)
      .post('/users/admins')
      .send({ ...newUserTwo, phone: newUser.phone });
    expect(responseUser).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        avatar_id: expect.any(Number),
      })
    );
    expect(responseUserTwo).toEqual(400);
  }, 30000);
  it('2.    - The user can list the all user register with pages.', async () => {
    await userFactory.createMany('User', 20);
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      avatar_id: logoId,
      confirmPassword: attributes.password,
      auth: process.env.APP_ADMIN,
    };
    const { body: responseUser } = await request(app)
      .post('/users/admins')
      .send(newUser);
    const {
      body: { token },
    } = await request(app)
      .post('/sessions')
      .send({ email: attributes.email, password: attributes.password });
    const { body: responseUserShow } = await request(app)
      .get('/users/admins')
      .set('Authorization', `bearer ${token}`);
    expect(responseUser).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        avatar_id: expect.any(Number),
        type: expect.any(String),
      })
    );
    expect(responseUserShow).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          avatar_id: expect.any(Number),
          avatar: expect.objectContaining({ url: expect.any(String) }),
          type: expect.any(String),
        }),
      ])
    );
  }, 30000);
  it('3.    - The user can list the especified user register with.', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      avatar_id: logoId,
      confirmPassword: attributes.password,
      auth: process.env.APP_ADMIN,
    };
    const { body: responseUser } = await request(app)
      .post('/users/admins')
      .send(newUser);
    const {
      body: { token },
    } = await request(app)
      .post('/sessions')
      .send({ email: attributes.email, password: attributes.password });
    const { body: responseUserShow } = await request(app)
      .get(`/users/${responseUser.id}/admins`)
      .set('Authorization', `bearer ${token}`);
    expect(responseUser).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        avatar_id: expect.any(Number),
        type: expect.any(String),
        avatar: expect.any({ url: expect.any(String) }),
      })
    );
    expect(responseUserShow).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        avatar_id: expect.any(Number),
        type: expect.any(String),
      })
    );
  }, 30000);
  it(`3.1   - The user can't list the especified user register without id exist.`, async () => {
    await userFactory.create('User');
    const { status: responseUser } = await request(app).get(`/users/0/admins`);
    expect(responseUser).toEqual(401);
  }, 30000);
  it('4     - The user can updated information.', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      avatar_id: logoId,
      confirmPassword: attributes.password,
      auth: process.env.APP_ADMIN,
    };
    const { body: user } = await request(app)
      .post(`/users/admins`)
      .send(newUser);
    const {
      body: { token },
    } = await request(app)
      .post('/sessions')
      .send({ email: attributes.email, password: attributes.password });
    const attributesUserModified = await userFactory.attrs('User');
    const newUserModified = {
      ...attributesUserModified,
      avatar_id: logoId,
      oldPassword: attributes.password,
      newPassword: attributesUserModified.password,
      confirmNewPassword: attributesUserModified.password,
    };
    const { body: responseUser } = await request(app)
      .put(`/users/${user.id}/admins/`)
      .send(newUserModified)
      .set('Authorization', `bearer ${token}`);
    expect(responseUser).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        type: expect.any(String),
        avatar_id: expect.any(Number),
      })
    );
  }, 30000);
  it('4.1.1 - The user can updated information, when email there is.', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      avatar_id: logoId,
      auth: process.env.APP_ADMIN,
      confirmPassword: attributes.password,
    };
    const { body: user } = await request(app)
      .post(`/users/admins`)
      .send(newUser);
    const attributesUserModified = await userFactory.attrs('User');
    const newUserModified = {
      ...attributesUserModified,
      avatar_id: logoId,
      oldPassword: attributes.password,
      newPassword: attributesUserModified.password,
      confirmNewPassword: attributesUserModified.password,
      email: newUser.email,
    };
    const { status: responseUser } = await request(app)
      .put(`/users/${user.id}/admins`)
      .send(newUserModified);
    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: expect.any(String),
        name: expect.any(String),
        phone: expect.any(String),
        avatar_id: expect.any(Number),
      })
    );
    expect(responseUser).toEqual(401);
  }, 30000);
  it('4.1.2 - The user can updated information, when there is phone.', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      avatar_id: logoId,
      confirmPassword: attributes.password,
      auth: process.env.APP_ADMIN,
    };
    const { body: user } = await request(app)
      .post(`/users/admins`)
      .send(newUser);
    const attributesUserModified = await userFactory.attrs('User');
    const newUserModified = {
      ...attributesUserModified,
      avatar_id: logoId,
      oldPassword: attributes.password,
      newPassword: attributesUserModified.password,
      confirmNewPassword: attributesUserModified.password,
      phone: attributes.phone,
    };
    const { status: responseUser } = await request(app)
      .put(`/users/${user.id}/admins`)
      .send(newUserModified);
    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: expect.any(String),
        name: expect.any(String),
        phone: expect.any(String),
        avatar_id: expect.any(Number),
      })
    );
    expect(responseUser).toEqual(401);
  }, 30000);
  it('4.1.3 - The user can updated information, when old password not.', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      avatar_id: logoId,
      auth: process.env.APP_ADMIN,
      confirmPassword: attributes.password,
    };
    const { body: user } = await request(app)
      .post(`/users/admins`)
      .send(newUser);
    const attributesUserModified = await userFactory.attrs('User');
    const newUserModified = {
      ...attributesUserModified,
      avatar_id: logoId,
      oldPassword: attributesUserModified.password,
      newPassword: attributesUserModified.password,
      confirmNewPassword: attributesUserModified.password,
    };
    const { status: responseUser } = await request(app)
      .put(`/users/${user.id}/admins`)
      .send(newUserModified);
    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: expect.any(String),
        name: expect.any(String),
        phone: expect.any(String),
        avatar_id: expect.any(Number),
      })
    );
    expect(responseUser).toEqual(401);
  }, 30000);
  it('5.    - Should be able to login to user.', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      avatar_id: logoId,
      confirmPassword: attributes.password,
      auth: process.env.APP_ADMIN,
    };
    const { body: responseUser } = await request(app)
      .post('/users/admins')
      .send(newUser);
    const { body: reponseLogin } = await request(app)
      .post('/sessions')
      .send({ email: attributes.email, password: attributes.password });
    expect(responseUser).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        avatar_id: expect.any(Number),
      })
    );
    expect(reponseLogin).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: expect.any(Number),
          email: expect.any(String),
        }),
        token: expect.any(String),
      })
    );
  }, 30000);
  it('5.1   - Should not be able to login to user whitout email valid.', async () => {
    const attributes = await userFactory.attrs('User');
    const { status: reponseLogin } = await request(app)
      .post('/sessions')
      .send({ email: attributes.email, password: attributes.password });
    expect(reponseLogin).toEqual(401);
  }, 30000);
  it('5.1   - Should not be able to login to user with invalid password.', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      avatar_id: logoId,
      confirmPassword: attributes.password,
      auth: process.env.APP_ADMIN,
    };
    const { body: responseUser } = await request(app)
      .post('/users/admins')
      .send(newUser);
    const { status: reponseLogin } = await request(app)
      .post('/sessions')
      .send({ email: attributes.email, password: '000000' });
    expect(responseUser).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        avatar_id: expect.any(Number),
      })
    );
    expect(reponseLogin).toEqual(401);
  }, 30000);
});
