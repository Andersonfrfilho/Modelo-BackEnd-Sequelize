// import Imagem from '../models/Imagem';
import { dataUri } from '../middlewares/multer';
import { uploader } from '../../config/cloudinaryConfig';
import File from '../models/File';

class FileController {
  async store(req, res) {
    if (!req.file) {
      return res.status(400).json({ error: 'erro ao subir arquivo' });
    }
    const file = dataUri(req).content;
    const { url } = await uploader.upload(file);
    if (!url) {
      return res.status(400).json({ error: 'erro ao subir imagem' });
    }

    const newFile = await File.create({
      url,
    });
    return res.status(200).json(newFile);
  }
}
export default new FileController();
