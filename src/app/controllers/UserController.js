import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exist' });
    }
    const { id, name, email, phone } = await User.create(req.body);
    return res.json({ id, name, email, phone });
  }

  async update(req, res) {
    const { name, phone, email, type, oldPassword } = req.body;
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
      if (!(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: 'password incorrect' });
      }
      const userModified = await user.update(req.body);
      return res.json(userModified);
    }
  }
}
export default new UserController();
