import User from '../../../models/User';
import File from '../../../models/File';
import Cache from '../../../../lib/Cache';
import '../../../../bootstrap';
import Notification from '../../../schemas/Notification';
import AdminCheckService from '../../../services/users/admins/CheckAdminService';

class AdminController {
  async store(req, res) {
    if (!(req.body.auth === process.env.APP_ADMIN)) {
      return res.status(401).json({
        error: 'you are not authorized to perform this action',
      });
    }
    const { email, phone, avatar_id } = req.body;
    const emailExist = await User.findOne({
      where: { email: email.toLowerCase() },
    });
    const phoneExist = await User.findOne({
      where: { phone: phone.toLowerCase() },
    });
    if (emailExist) {
      return res.status(401).json({
        error: 'the email you are trying to register is already registered',
      });
    }
    if (phoneExist) {
      return res.status(401).json({
        error: 'the phone you are trying to register is already registered',
      });
    }
    const imageExist = await File.findOne({
      where: { id: avatar_id },
    });
    const avatar = imageExist ? avatar_id : null;
    const newUser = {
      name: req.body.name,
      email,
      phone,
      type: 'admin',
      password: req.body.password,
      avatar_id: avatar,
    };
    const { id } = await User.create(newUser);
    // invalidando os caches
    // await Cache.invalidate('users');
    // await Cache.invalidatePrefix('users:admins:page');
    // criando notificação

    const notification = await Notification.create({
      content: `${req.body.name}, seu cadastro foi realizado com sucesso`,
      user: id,
    });
    // // trabalahndo com socket.io
    const ownerSocket = req.connectedUsers[id];
    if (ownerSocket) {
      req.io.to(ownerSocket).emit('notification', notification);
    }
    return res.json({ ...newUser, id });
  }

  async index(req, res) {
    await AdminCheckService.run({
      admin_id: req.userId,
    });
    const {
      page = 1,
      pageSize = 10,
      filter = '',
      order = ['name'],
    } = req.query;
    // personalizando cache
    const cacheKey = `users:admins:page:${page}`;

    const cached = await Cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    const listUsers = await User.findAll({
      where: {
        type: 'admin',
      },
      attributes: ['id', 'name', 'email', 'avatar_id', 'type'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['url'],
        },
      ],
      limit: pageSize,
      filter,
      offset: (page - 1) * pageSize,
      order,
    });
    await Cache.set(cacheKey, listUsers);
    return res.json(listUsers);
  }

  async show(req, res) {
    await AdminCheckService.run({
      admin_id: req.userId,
    });
    const { id } = req.params;
    // personalizando cache
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'avatar_id', 'type'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['url'],
        },
      ],
    });
    return res.json(user);
  }

  async update(req, res) {
    await AdminCheckService.run({
      admin_id: req.userId,
    });
    const { id } = req.params;
    // personalizando cache
    const { email, phone, avatar_id } = req.body;
    const emailExist = await User.findOne({
      where: { email: email.toLowerCase() },
    });
    const phoneExist = await User.findOne({
      where: { phone: phone.toLowerCase() },
    });
    if (emailExist) {
      return res.status(401).json({
        error: 'the email you are trying to register is already registered',
      });
    }
    if (phoneExist) {
      return res.status(401).json({
        error: 'the phone you are trying to register is already registered',
      });
    }
    const oldUser = await User.findByPk(id);
    let logo;
    if (avatar_id) {
      const imageExist = await File.findByPk(avatar_id);
      logo = imageExist ? avatar_id : oldUser.avatar_id;
    }
    const user = await User.findByPk(id);
    const userModified = await user.update({ ...req.body, avatar_id: logo });
    // invalidando os caches
    await Cache.invalidate('users');
    await Cache.invalidatePrefix('users:admins:page');
    // criando notificação

    const notification = await Notification.create({
      content: `${req.body.name}, seu usuario foi modificado com sucesso`,
      user: id,
    });
    // // trabalahndo com socket.io
    const ownerSocket = req.connectedUsers[id];
    if (ownerSocket) {
      req.io.to(ownerSocket).emit('notification', notification);
    }
    return res.json(userModified);
  }

  async destroy(req, res) {
    await AdminCheckService.run({
      admin_id: req.userId,
    });
    const { id } = req.params;
    // personalizando cache
    const deleteUser = await User.findByPk(id);
    // invalidando os caches
    await Cache.invalidate('users');
    await Cache.invalidatePrefix('users:admins:page');
    // criando notificação

    const notification = await Notification.create({
      content: `O usuario ${deleteUser.name}, seu usuario foi deletado com sucesso`,
      user: id,
    });
    // // trabalahndo com socket.io
    const ownerSocket = req.connectedUsers[id];
    if (ownerSocket) {
      req.io.to(ownerSocket).emit('notification', notification);
    }
    return res.json(deleteUser);
  }
}
export default new AdminController();
