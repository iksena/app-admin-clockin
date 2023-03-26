import {
  Col, Menu, Row, Typography,
} from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import withSession from '@/lib/session';
import fetcher from '@/lib/fetcher';
import ProfileForm from '@/components/profile-form';
import constants from '@/lib/constants';
import ClockInOut from '@/components/clock-inout';
import { startOfMonth } from 'date-fns';
import AbsenceHistories from '@/components/absence-histories';
import Head from 'next/head';

function MenuComponent({ selectedKey = 'profile', setMenu }) {
  const menuItems = [
    { key: 'profile', label: 'Profile' },
    { key: 'clock', label: 'Clock In/Out' },
    { key: 'absences', label: 'Absence Histories' },
    { key: 'logout', label: 'Log out' },
  ];

  return (
    <Menu
      onClick={({ key }) => setMenu(key)}
      defaultSelectedKeys={[selectedKey]}
      mode="inline"
      items={menuItems}
    />
  );
}

const _handleUpdateUser = (router) => async (values) => {
  const url = '/api/employees';
  try {
    await fetcher(url, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      method: 'PATCH',
    });
    router.push('/home?menu=profile');

    return true;
  } catch (error) {
    // TODO add error handling snackbar
    return false;
  }
};

const _handleClockInOut = (user, absenceStatus, router, baseUrl) => async () => {
  const url = `${baseUrl}/absences`;
  try {
    await fetcher(url, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        time: new Date().toISOString(),
        status: absenceStatus,
      }),
      method: 'POST',
    });
    router.push('/home?menu=clock');

    return true;
  } catch (error) {
    // TODO add error handling snackbar
    return false;
  }
};

const _handleGetHistories = (router) => (_, [startDate, endDate]) => {
  router.push(`/home?menu=absences&startDate=${startDate}&endDate=${endDate}`);
};

function ErrorView({ error }) {
  return (
    <>
      <Row>An error occured, please reload the page.</Row>
      <Row>{error.message}</Row>
      <Row>{error.trace}</Row>
    </>
  );
}

function Home({
  user, absences, selectedMenu, baseUrl,
  absenceHistories, startDate, endDate, error,
}) {
  const router = useRouter();
  const [menu, setMenu] = useState(selectedMenu);

  useEffect(() => {
    if (menu === 'logout') {
      router.push('/logout');
    }
  }, [router, menu]);

  return error
    ? <ErrorView error={error} />
    : (
      <>
        <Head>
          <title>Home - Employee ClockIn</title>
          <meta name="description" content="employee clockin app Home for Argon" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <Row justify="center" style={{ marginTop: 5 }}>
            <Typography.Title level={2}>Employee Clockin</Typography.Title>
          </Row>
          <Row justify="center" style={{ marginTop: 5 }}>
            <Col span={4}>
              <MenuComponent selectedKey={selectedMenu} setMenu={setMenu} />
            </Col>
            <Col span={20}>
              {menu === 'profile' && (
                <ProfileForm user={user} onFinish={_handleUpdateUser(router)} />
              )}
              {menu === 'clock' && (
                <ClockInOut
                  absences={absences}
                  onClockIn={_handleClockInOut(user, 'CLOCK_IN', router, baseUrl)}
                  onClockOut={_handleClockInOut(user, 'CLOCK_OUT', router, baseUrl)}
                />
              )}
              {menu === 'absences' && (
                <AbsenceHistories
                  absences={absenceHistories}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={_handleGetHistories(router)}
                />
              )}
            </Col>
          </Row>
        </main>
      </>
    );
}

export const getServerSideProps = withSession(async ({ req, query }) => {
  try {
    const selectedMenu = query?.menu ?? 'profile';
    const user = req.session.get('user');
    const isLoggedIn = (user && user.isLoggedIn) || false;
    if (!isLoggedIn) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const { email } = user;

    const todayDate = new Date().toISOString();
    const url = `${constants.BASE_URL}/absences?email=${email}&startDate=${todayDate}&endDate=${todayDate}`;
    const absences = await fetcher(url);

    const startDate = query.startDate
      ? new Date(query.startDate).toISOString()
      : startOfMonth(new Date()).toISOString();
    const endDate = query.endDate ? new Date(query.endDate).toISOString() : todayDate;
    const historiesUrl = `${constants.BASE_URL}/absences?email=${email}&startDate=${startDate}&endDate=${endDate}`;
    const absenceHistories = await fetcher(historiesUrl);

    return {
      props: {
        baseUrl: constants.BASE_URL,
        user,
        absences,
        selectedMenu,
        absenceHistories,
        startDate,
        endDate,
      },
    };
  } catch (error) {
    return {
      props: {
        error: {
          message: error?.message,
          trace: JSON.stringify(error),
        },
      },
    };
  }
});

export default Home;
