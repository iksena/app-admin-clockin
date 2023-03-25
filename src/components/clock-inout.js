const {
  Row, Col, Typography, Button,
} = require('antd');
const { default: format } = require('date-fns/format');

const _findLastAbsence = (absences = []) => {
  const lastClockIn = absences.find((absence) => absence?.status === 'CLOCK_IN');
  const lastClockOut = absences.find((absence) => absence?.status === 'CLOCK_OUT');

  return [lastClockIn?.time, lastClockOut?.time];
};

function ClockInOut({ absences, onClockIn, onClockOut }) {
  const [clockIn, clockOut] = _findLastAbsence(absences);
  const dateFormat = 'd MMM yyyy';
  const timeFormat = 'hh:mm';

  return (
    <>
      <Row span={16}>
        <Col span={8}>
          <Typography.Text>{format(new Date(clockIn), dateFormat)}</Typography.Text>
          <Typography.Title level={3}>{format(new Date(clockIn), timeFormat)}</Typography.Title>
        </Col>
        <Col span={8}>
          <Typography.Text>{format(new Date(clockOut), dateFormat)}</Typography.Text>
          <Typography.Title level={3}>{format(new Date(clockOut), timeFormat)}</Typography.Title>
        </Col>
      </Row>
      <Row span={16}>
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
