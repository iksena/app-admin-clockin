import {

  Col,
  Row,
  Typography,
} from 'antd';
import Head from 'next/head';

import { useRouter } from 'next/router';

import fetcher from '@/lib/fetcher';
import constants from '@/lib/constants';
import MenuComponent from '@/components/menu';
import { startOfMonth } from 'date-fns';
import AbsenceHistories from '@/components/absence-histories';

function ErrorView({ error }) {
  return (
    <>
      <Row>An error occured, please reload the page.</Row>
      <Row>{error.message}</Row>
      <Row>{error.trace}</Row>
    </>
  );
}

const _handleGetHistories = (router) => (_, [startDate, endDate]) => {
  router.push(`/absences?startDate=${startDate}&endDate=${endDate}`);
};

function Absences({
  absenceHistories, error, startDate, endDate,
}) {
  const router = useRouter();

  return error
    ? <ErrorView error={error} />
    : (
      <>
        <Head>
          <title>Absences - Admin ClockIn</title>
          <meta name="description" content="admin clockin app for Argon - Absence List page" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <Row justify="center" style={{ marginTop: 5 }}>
            <Typography.Title level={2}>Admin Clockin</Typography.Title>
          </Row>
          <Row justify="center">
            <Col span={8} sm={10} xs={18}>
              <MenuComponent selectedKey="absences" />
            </Col>
          </Row>
          <Row justify="center" style={{ marginTop: 10 }}>
            <Col span={8} sm={10} xs={18}>
              <AbsenceHistories
                absences={absenceHistories}
                startDate={startDate}
                endDate={endDate}
                onChange={_handleGetHistories(router)}
              />
            </Col>
          </Row>
        </main>
      </>
    );
}

export const getServerSideProps = async ({ query }) => {
  try {
    const todayDate = new Date().toISOString();
    const startDate = query.startDate
      ? new Date(query.startDate).toISOString()
      : startOfMonth(new Date()).toISOString();
    const endDate = query.endDate ? new Date(query.endDate).toISOString() : todayDate;

    const url = `${constants.BASE_URL}/absences?&startDate=${startDate}&endDate=${endDate}`;
    const absenceHistories = await fetcher(url);

    return {
      props: {
        baseUrl: constants.BASE_URL,
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
};

export default Absences;
