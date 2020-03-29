import User from '../../models/User';
import Queue from '../../../lib/Queue';
import ConfirmationMail from '../../jobs/ConfirmationMail';
import Notification from '../../schemas/Notification';
import File from '../../models/File';
// import CreateAdminService from '../services/CreateAdminService';
import Cache from '../../../lib/Cache';

class UserController {
  async store(req, res) {
    const userEmailExists = await User.findOne({
      where: { email: req.body.email },
    });
    if (userEmailExists) {
      return res.status(400).json({ error: 'User already exist email' });
    }
    const userPhoneExists = await User.findOne({
      where: { phone: req.body.phone },
    });
    if (userPhoneExists) {
      return res.status(400).json({ error: 'User already exist phone' });
    }
    const imageUser = await File.findByPk(req.body.avatar_id);
    const logo = imageUser ? req.body.avatar_id : null;

    const { id, name, email, phone, avatar_id } = await User.create({
      ...req.body,
      avatar_id: logo,
    });
    // notification
    const notification = await Notification.create({
      content: `${name}, seu cadastro foi realizado com sucesso`,
      user: id,
    });
    // notification com socket.io
    const ownerSocket = req.connectedUsers[id];
    if (ownerSocket) {
      req.io.to(ownerSocket).emit('notification', notification);
    }
    // invalidando cache pois houve modificações
    await Cache.invalidate('users');
    await Cache.invalidatePrefix('user:admins:page:');
    await Queue.add(ConfirmationMail.key, { name });
    return res.json({ id, name, email, phone, avatar_id });
  }

  async index(req, res) {
    // verify exist cache in users page
    const {
      page = 1,
      pageSize = 10,
      filter = '',
      order = ['email'],
    } = req.query;
    const cacheKey = `user:${req.userId}pages:${page}`;
    const userList = await User.findAll({
      where: {
        permissao: 'mestre',
      },
      attributes: ['id', 'name', 'email', 'phone'],
      limit: pageSize,
      filter,
      offset: (page - 1) * pageSize,
      order,
    });
    // service cache (first:name:string, objeto)
    await Cache.set(cacheKey, userList);

    return res.json(userList);
  }

  async show(req, res) {
    // verify exist cache in users
    const cached = await Cache.get('user');
    if (cached) {
      return res.json(cached);
    }
    const {
      page = 1,
      pageSize = 10,
      filter = '',
      order = ['email'],
    } = req.query;
    const userList = await User.findAll({
      where: {
        permissao: 'mestre',
      },
      attributes: ['id', 'name', 'email', 'phone'],
      limit: pageSize,
      filter,
      offset: (page - 1) * pageSize,
      order,
    });
    // service cache (first:name:string, objeto)
    await Cache.set('user', userList);
    return res.json(userList);
  }

  async update(req, res) {
    const { name, phone, email, type, oldPassword } = req.body;
    // separeted logic in services
    // const appointment = await CreateAdminService.run({
    //   admin_id: id,
    // });
    const user = await User.findByPk(req.userId);
    if (user.type !== 'admin') {
      return res.status(401).json({ error: 'User not autorized' });
    }
    const emailExist = await User.findOne({ where: { email } });
    if (emailExist) {
      return res.status(401).json({ error: 'Email exist try other' });
    }
    const phoneExist = await User.findOne({ where: { phone } });
    if (phoneExist) {
      return res.status(401).json({ error: 'Telephone exist try other' });
    }
    if (oldPassword) {
      const data = await user.checkPassword(oldPassword);
      if (!(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: 'password incorrect' });
      }
      const userModified = await user.update(req.body);
      await Cache.invalidate('users');
      return res.json(userModified);
    }
  }
}
export default new UserController();
