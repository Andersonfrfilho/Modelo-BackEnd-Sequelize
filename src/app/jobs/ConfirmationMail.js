import Mail from '../../lib/Mail';

class ConfirmationMail {
  get Key() {
    return 'ConfirmationMail';
  }

  async handle({ data }) {
    const { name } = data;

    await Mail.sendMail({
      to: `${name} <andersonfrfilho@gmail.com>`,
      subject: 'Empresa criada',
      template: 'confirmation',
      context: {
        user: 'Anderson',
        company: 'incca sistemas',
      },
    });
  }
}
export default new ConfirmationMail();
