const {
  List, Avatar, Button,
} = require('antd');

const _constructDescription = (employee) => `
    Email: ${employee.email};
    Phone: ${employee.phone};
    Position: ${employee.position}
`;

function EmployeeList({ employees, onEdit }) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={employees}
      renderItem={(item) => (
        <List.Item
          actions={[<Button key="edit-button" onClick={onEdit(item)}>Edit</Button>]}
        >
          <List.Item.Meta
            avatar={<Avatar src={item.imageUri} />}
            title={item.name}
            description={_constructDescription(item)}
          />
        </List.Item>
      )}
    />
  );
}

export default EmployeeList;
