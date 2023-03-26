import { format } from 'date-fns';
import {
  Row, Col, Typography, Button,
} from 'antd';

const _findLastAbsence = (absences = []) => {
  const dateFormat = 'd MMM yyyy';
  const timeFormat = 'HH:mm';

  const lastClockIn = absences.find((absence) => absence?.status === 'CLOCK_IN');
  const lastClockOut = absences.find((absence) => absence?.status === 'CLOCK_OUT');

  const todayDate = format(new Date(), dateFormat);
  const clockInDate = lastClockIn?.time
    ? format(new Date(lastClockIn?.time), dateFormat)
    : todayDate;
  const clockOutDate = lastClockOut?.time
    ? format(new Date(lastClockOut?.time), dateFormat)
    : todayDate;
  const clockInTime = lastClockIn?.time ? format(new Date(lastClockIn?.time), timeFormat) : '-';
  const clockOutTime = lastClockOut?.time ? format(new Date(lastClockOut?.time), timeFormat) : '-';

  return {
    clockInDate, clockOutDate, clockInTime, clockOutTime,
  };
};

function ClockInOut({ absences, onClockIn, onClockOut }) {
  const {
    clockInDate, clockOutDate, clockInTime, clockOutTime,
  } = _findLastAbsence(absences);

  return (
    <>
      <Row span={10} justify="center">
        <Col span={5}>
          <Typography.Text>{clockInDate}</Typography.Text>
          <Typography.Title level={3}>{clockInTime}</Typography.Title>
        </Col>
        <Col span={5}>
          <Typography.Text>{clockOutDate}</Typography.Text>
          <Typography.Title level={3}>{clockOutTime}</Typography.Title>
        </Col>
      </Row>
      <Row span={10} justify="center">
        <Col span={5}>
          <Button type="primary" onClick={onClockIn}>Clock In</Button>
        </Col>
        <Col span={5}>
          <Button type="primary" onClick={onClockOut}>Clock Out</Button>
        </Col>
      </Row>
    </>
  );
}

export default ClockInOut;
