import * as Yup from 'yup';
import User from '../models/User';
import Queue from '../../lib/Queue';
import ConfirmationMail from '../jobs/ConfirmationMail';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
      phone: Yup.string().required(),
      type: Yup.string().required(),
      avatar_id: Yup.string(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation error' });
    }
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
    await Queue(ConfirmationMail.key, {
      name: 'ANderson',
    });
    return res.json({ id, name, email, phone });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      phone: Yup.string().required(),
      type: Yup.string().required(),
      oldPassword: Yup.string().min(6),
      newPassword: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmNewPassword: Yup.string().when(
        'newPassword',
        (newPassword, field) =>
          newPassword ? field.required().oneOf([Yup.ref('newPassword')]) : field
      ),
      avatar_id: Yup.string(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation error' });
    }
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
      const data = await user.checkPassword(oldPassword);
      console.log(data);
      if (!(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: 'password incorrect' });
      }
      const userModified = await user.update(req.body);
      return res.json(userModified);
    }
  }
}
export default new UserController();
