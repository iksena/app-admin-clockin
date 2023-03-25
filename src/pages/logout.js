import { Typography } from 'antd';

import withSession from '@/lib/session';

function Logout() {
  return <Typography.Text>Logging out...</Typography.Text>;
}

export const getServerSideProps = withSession(async ({ req }) => {
  req.session.destroy();

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
});

export default Logout;
