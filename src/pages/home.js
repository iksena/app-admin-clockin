import { Col, Menu, Row } from 'antd';
import withSession from '@/lib/session';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProfileForm from '@/components/profile-form';

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

function Home({ user }) {
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
          <ProfileForm user={user} onFinish={console.log} />
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

  return {
    props: {
      user,
    },
  };
});

export default Home;
