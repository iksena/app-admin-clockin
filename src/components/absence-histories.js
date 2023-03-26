import { format } from 'date-fns';
import dayjs from 'dayjs';

const {
  Row, Col, DatePicker, Table,
} = require('antd');

const columns = [
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Clock In',
    dataIndex: 'clockIn',
    key: 'clockIn',
  },
  {
    title: 'Clock Out',
    dataIndex: 'clockOut',
    key: 'clockOut',
  },
];

const _mapAbsences = (absences) => {
  const dateFormat = 'yyyy-MM-dd HH:mm';

  return absences.map((absence) => ({
    key: absence.date,
    email: absence.email,
    clockIn: absence.clockIn ? format(new Date(absence.clockIn), dateFormat) : '-',
    clockOut: absence.clockOut ? format(new Date(absence.clockOut), dateFormat) : '-',
  }), []);
};

function AbsenceHistories({
  startDate, endDate, onChange, absences,
}) {
  return (
    <>
      <Row span={16}>
        <Col>
          <DatePicker.RangePicker
            defaultValue={[dayjs(startDate), dayjs(endDate)]}
            onChange={onChange}
          />
        </Col>
      </Row>
      <Table columns={columns} dataSource={_mapAbsences(absences)} />
    </>
  );
}

export default AbsenceHistories;
