import User from '../models/User';
import Queue from '../../lib/Queue';
import ConfirmationMail from '../jobs/ConfirmationMail';
import Notification from '../schemas/Notification';
// import CreateAdminService from '../services/CreateAdminService';
import Cache from '../../lib/Cache';

class UserController {
  async index(req, res) {
    // verify exist cache in users
    const cached = await Cache.get('users');
    if (cached) {
      return res.json(cached);
    }
    const users = await User.findAll();
    // service cache (first:name:string, objeto)
    await Cache.set('users', users);
    return res.json(users);
  }

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
    const { id, name, email, phone } = await User.create(req.body);
    // invalidar cache
    await Cache.invalidate('users');
    // await Cache.invalidatePrefix(`user:${req.userId}:photo`);
    // notificando
    await Notification.create({
      content: 'uhul, vc se cadastrou',
      user: 3,
    });
    // enviando email
    await Queue.add(ConfirmationMail.key, { name: 'nome_fantasia' });
    return res.json({ id, name, email, phone });
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
