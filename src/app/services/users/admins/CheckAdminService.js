import User from '../../../models/User';

class CheckAdmin {
  async run({ admin_id }) {
    const user = await User.findOne({
      where: { id: admin_id, type: 'admin' },
    });
    if (!user) {
      throw new Error('You Can only create appointments with providers');
    }
  }
}
export default new CheckAdmin();
