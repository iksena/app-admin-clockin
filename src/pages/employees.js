import {
  Button,
  Col,
  Row,
  Typography,
} from 'antd';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';

import fetcher from '@/lib/fetcher';
import constants from '@/lib/constants';
import EmployeeList from '@/components/employee-list';
import ProfileForm from '@/components/profile-form';

function ErrorView({ error }) {
  return (
    <>
      <Row>An error occured, please reload the page.</Row>
      <Row>{error.message}</Row>
      <Row>{error.trace}</Row>
    </>
  );
}

const _handleEditClick = (setEditEmployee, setNew) => (item) => () => {
  setEditEmployee(item);
  setNew(false);
};

const _handleUpdateUser = (router, baseUrl, isNew, setNew) => async (values) => {
  const url = `${baseUrl}/employees`;
  try {
    await fetcher(url, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      method: isNew ? 'POST' : 'PATCH',
    });
    router.push('/employees');
    setNew(false);

    return true;
  } catch (error) {
    // TODO add error handling snackbar
    return false;
  }
};

function Home({
  employees, error, baseUrl,
}) {
  const router = useRouter();
  const [editEmployee, setEditEmployee] = useState({});
  const [isNewEmployee, setNew] = useState(false);

  return error
    ? <ErrorView error={error} />
    : (
      <>
        <Head>
          <title>Employees - Admin ClockIn</title>
          <meta name="description" content="admin clockin app for Argon - Employee List page" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <Row justify="center" style={{ marginTop: 5 }}>
            <Typography.Title level={2}>Admin Clockin</Typography.Title>
          </Row>
          <Row justify="center" style={{ marginTop: 5 }}>
            <Col span={8} sm={10} xs={18}>
              <EmployeeList
                employees={employees}
                onEdit={_handleEditClick(setEditEmployee, setNew)}
              />
              <Button
                type="primary"
                style={{ marginTop: 16 }}
                onClick={() => {
                  setNew(true);
                  setEditEmployee({});
                }}
              >
                New Employee
              </Button>
            </Col>
            <Col span={8} sm={10} xs={18}>
              {(editEmployee?.email || isNewEmployee) && (
                <ProfileForm
                  user={editEmployee}
                  onFinish={_handleUpdateUser(router, baseUrl, isNewEmployee, setNew)}
                />
              )}
            </Col>
          </Row>
        </main>
      </>
    );
}

export const getServerSideProps = async () => {
  const url = `${constants.BASE_URL}/employees`;
  const employees = await fetcher(url);

  try {
    return {
      props: {
        baseUrl: constants.BASE_URL,
        employees,
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
};

export default Home;
