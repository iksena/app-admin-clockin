import { Row, Typography } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';

import LoginForm from '@/components/login-form';
import withSession from '@/lib/session';
import fetcher from '@/lib/fetcher';

const _handleLogin = (router) => async ({ email, password }) => {
  const url = '/api/login';
  try {
    await fetcher(url, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      method: 'POST',
    });
    router.push('/home');

    return true;
  } catch (error) {
    return false;
  }
};

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Login - Employee ClockIn</title>
        <meta name="description" content="employee clockin app for Argon" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Row justify="center" style={{ marginTop: 25 }}>
          <Typography.Title level={2}>Employee Clockin</Typography.Title>
        </Row>
        <Row justify="center" style={{ marginTop: 50 }}>
          <LoginForm onFinish={_handleLogin(router)} />
        </Row>
      </main>
    </>
  );
}

export const getServerSideProps = withSession(async ({ req }) => {
  const user = req.session.get('user');
  const isLoggedIn = (user && user.isLoggedIn) || false;
  if (isLoggedIn) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    };
  }

  return {
    props: {
      isLoggedIn,
    },
  };
});
