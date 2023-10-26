import * as process from 'process';

export default () => ({
  email: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_POST,
    username: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
  },
});
