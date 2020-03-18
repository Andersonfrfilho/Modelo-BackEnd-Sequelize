import Mail from '../../lib/Mail';

class ConfirmationMail {
  get key() {
    return 'ConfirmationMail';
  }

  async handle({ data }) {
    const { name } = data;
    await Mail.sendMail({
      to: `${name} <andersonfrfilho@gmail.com>`,
      subject: 'cadastrou',
      template: 'confirmation',
      context: {
        user: 'aew butão.',
      },
    });
  }
}
export default new ConfirmationMail();
