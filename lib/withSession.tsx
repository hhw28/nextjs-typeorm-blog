import {withIronSession} from 'next-iron-session';
import {NextApiHandler} from 'next';

export function withSession(handler: NextApiHandler) {
  return withIronSession(handler, {
    // password: process.env.SECRET_COOKIE_PASSWORD,
    password: '7e611f66-c5a6-af0a-d18c-64019517c367',
    cookieName: 'blog',
    cookieOptions: {secure: false}
  });
}