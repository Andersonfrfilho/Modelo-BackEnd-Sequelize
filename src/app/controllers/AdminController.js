import User from '../models/User';
import File from '../models/File';
import Cache from '../../lib/Cache';

class AdminController {
  async index(req, res) {
    // personalizando cache
    // const cacheKey = `user:${req.userId}:photo:${page}`;
    // const cached = await Cache.get(cacheKey);
    // if (cached) {
    //   return res.json(cached);
    // }
    const admins = await User.findAll({
      where: { type: 'admin' },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['url'],
        },
      ],
    });
    // await Cache.set(cacheKey, admins);
    return res.json(admins);
  }
}
export default new AdminController();
