import constants from '@/lib/constants';
import fetcher from '@/lib/fetcher';
import withSession from '@/lib/session';

const handler = async (req, res) => {
  if (req.method === 'PATCH') {
    const url = `${constants.BASE_URL}/employees`;
    try {
      const user = await fetcher(url, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
        method: 'PATCH',
      });

      req.session.set('user', {
        ...user,
        isLoggedIn: true,
      });
      await req.session.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(error.body?.statusCode ?? 500).json(error.body);
    }
  }
};

export default withSession(handler);
