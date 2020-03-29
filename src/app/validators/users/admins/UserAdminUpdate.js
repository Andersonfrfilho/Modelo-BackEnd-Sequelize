import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      newPassword: Yup.string()
        .min(6)
        .when('oldPassword', (newPassword, field) =>
          newPassword ? field.required() : field
        ),
      confirmNewPassword: Yup.string().when(
        'newPassword',
        (newPassword, field) =>
          newPassword ? field.required().oneOf([Yup.ref('newPassword')]) : field
      ),
      phone: Yup.string(),
      type: Yup.string(),
      avatar_id: Yup.string(),
    });
    await schema.validate(req.body, { abortEarly: false });
    return next();
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'error de validação de dados', messages: error.inner });
  }
};
