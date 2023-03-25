import { Col, Menu, Row } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import withSession from '@/lib/session';
import fetcher from '@/lib/fetcher';
import ProfileForm from '@/components/profile-form';
import constants from '@/lib/constants';
import ClockInOut from '@/components/clock-inout';

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
    router.reload();

    return true;
  } catch (error) {
    return false;
  }
};

function Home({ user, absences }) {
  const router = useRouter();
  const [menu, setMenu] = useState('profile');

  useEffect(() => {
    if (menu === 'logout') {
      router.push('/logout');
    }
  }, [router, menu]);

  return (
    <Row justify="center">
      <Col span={4}>
        <MenuComponent selectedKey={menu} setMenu={setMenu} />
      </Col>
      <Col span={20}>
        {menu === 'profile' && (
          <ProfileForm user={user} onFinish={_handleUpdateUser(router)} />
        )}
        {menu === 'clock' && (
          <ClockInOut absences={absences} />
        )}
      </Col>
    </Row>
  );
}

export const getServerSideProps = withSession(async ({ req }) => {
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

  return {
    props: {
      user,
      absences,
    },
  };
});

export default Home;
