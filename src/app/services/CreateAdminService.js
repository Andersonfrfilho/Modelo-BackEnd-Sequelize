import User from '../models/User';

class CreateAdmin {
  async run({ admin_id }) {
    const user = await User.findOne({
      where: { id: admin_id },
    });
    if (!user) {
      throw new Error('You Can only create appointments with providers');
    }
  }
}
export default new CreateAdmin();
