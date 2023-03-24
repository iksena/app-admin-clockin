import { withIronSession } from 'next-iron-session';
import constants from './constants';

export default function withSession(handler) {
  return withIronSession(handler, {
    password: constants.SESSION_PASSWORD,
    cookieName: 'employee-clockin',
    cookieOptions: {
      secure: true,
    },
    ttl: constants.SESSION_EXPIRY_SECONDS,
  });
}
