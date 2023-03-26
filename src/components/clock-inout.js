import { format, isToday } from 'date-fns';
import {
  Row, Col, Typography, Button,
} from 'antd';

const _findLastAbsence = (absences = []) => {
  const dateFormat = 'd MMM yyyy';
  const timeFormat = 'HH:mm';
  const todayDate = format(new Date(), dateFormat);

  const absence = absences.find((foundAbsence) => isToday(new Date(foundAbsence.time)));

  const clockInDate = absence?.clockIn
    ? format(new Date(absence?.clockIn), dateFormat)
    : todayDate;
  const clockOutDate = absence?.clockOut
    ? format(new Date(absence?.clockOut), dateFormat)
    : todayDate;
  const clockInTime = absence?.clockIn ? format(new Date(absence?.clockIn), timeFormat) : '-';
  const clockOutTime = absence?.clockOut ? format(new Date(absence?.clockOut), timeFormat) : '-';

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
      <Row justify="center">
        <Col span={8}>
          <Typography.Text>{clockInDate}</Typography.Text>
          <Typography.Title level={3}>{clockInTime}</Typography.Title>
        </Col>
        <Col span={8}>
          <Typography.Text>{clockOutDate}</Typography.Text>
          <Typography.Title level={3}>{clockOutTime}</Typography.Title>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={8}>
          <Button type="primary" onClick={onClockIn}>Clock In</Button>
        </Col>
        <Col span={8}>
          <Button type="primary" onClick={onClockOut}>Clock Out</Button>
        </Col>
      </Row>
    </>
  );
}

export default ClockInOut;
