import request from 'supertest';
import bcrypt from 'bcryptjs';
import { object, number } from 'yup';
import app from '../../src/app';
import truncate from '../util/truncate';
import { userFactory, fileFactory } from '../factory';
import Cache from '../../src/lib/Cache';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('1.    - Should be able to register user.', async () => {
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
  it('1.1   - Should not be able to register user without fields valids.', async () => {
    const responseUser = await request(app)
      .post('/users')
      .send();
    expect(responseUser.status).toEqual(400);
  });
  it('1.1.1 - Should not be able to register user without fields valids specified (name).', async () => {
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
  it('1.1.2 - Should not be able to register user without fields valids specified (email).', async () => {
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
  it('1.1.3 - Should not be able to register user without fields valids specified (phone).', async () => {
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
  it('1.1.4 - Should not be able to register user without fields valids specified (password).', async () => {
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
  it('1.1.5 - Should not be able to register user without fields valids specified (type).', async () => {
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
  it('1.2   - The user can register with a non-existent image but it will have the value of null or inexistent.', async () => {
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
  it('1.3   - The user can register with a non-existent image but it will have the value of null or inexistent.', async () => {
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
  it(`1.4   - The user can't do register with email existent.`, async () => {
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
    const newAttributes = await userFactory.attrs('User');
    const newUserTwo = {
      ...newAttributes,
      avatar_id: logoId,
      confirmPassword: newAttributes.password,
    };
    const { status: responseUserTwo } = await request(app)
      .post('/users')
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
  });
  it(`1.5   - The user can't do register with phone existent.`, async () => {
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
    const newAttributes = await userFactory.attrs('User');
    const newUserTwo = {
      ...newAttributes,
      avatar_id: logoId,
      confirmPassword: newAttributes.password,
    };
    const { status: responseUserTwo } = await request(app)
      .post('/users')
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
  });
  it('2.    - The user can list the all user register with pages.', async () => {
    await userFactory.create('User');
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
  it('3.    - The user can list the especified user register with.', async () => {
    const { id } = await userFactory.create('User');
    const { body: responseUser } = await request(app).get(`/users/${id}`);
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
  it(`3.1   - The user can't list the especified user register without id exist.`, async () => {
    await userFactory.create('User');
    const { status: responseUser } = await request(app).get(`/users/0`);
    expect(responseUser).toEqual(400);
  });
  it('4     - The user can updated information.', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      avatar_id: logoId,
      confirmPassword: attributes.password,
    };
    const { body: user } = await request(app)
      .post(`/users`)
      .send(newUser);
    const attributesUserModified = await userFactory.attrs('User');
    const newUserModified = {
      ...attributesUserModified,
      avatar_id: logoId,
      oldPassword: attributes.password,
      newPassword: attributesUserModified.password,
      confirmNewPassword: attributesUserModified.password,
    };
    const { body: responseUser } = await request(app)
      .put(`/users/${user.id}`)
      .send(newUserModified);
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
  });
  it('4.1.1 - The user can updated information, when email there is.', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      avatar_id: logoId,
      confirmPassword: attributes.password,
    };
    const { body: user } = await request(app)
      .post(`/users`)
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
      .put(`/users/${user.id}`)
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
    expect(responseUser).toEqual(400);
  });
  it('4.1.2 - The user can updated information, when there is phone.', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      avatar_id: logoId,
      confirmPassword: attributes.password,
    };
    const { body: user } = await request(app)
      .post(`/users`)
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
      .put(`/users/${user.id}`)
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
    expect(responseUser).toEqual(400);
  });
  it('4.1.3 - The user can updated information, when old password not.', async () => {
    const { id: logoId } = await fileFactory.create('File');
    const attributes = await userFactory.attrs('User');
    const newUser = {
      ...attributes,
      avatar_id: logoId,
      confirmPassword: attributes.password,
    };
    const { body: user } = await request(app)
      .post(`/users`)
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
      .put(`/users/${user.id}`)
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
  });
  it('5.    - Should be able to login to user.', async () => {
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
  });
  it('5.1   - Should not be able to login to user whitout email valid.', async () => {
    const attributes = await userFactory.attrs('User');
    const { status: reponseLogin } = await request(app)
      .post('/sessions')
      .send({ email: attributes.email, password: attributes.password });
    expect(reponseLogin).toEqual(401);
  });
  it('5.1   - Should not be able to login to user with invalid password.', async () => {
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
  });
});
