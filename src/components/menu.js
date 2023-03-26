import { useRouter } from 'next/router';
import { Menu } from 'antd';

function MenuComponent({ selectedKey = 'employees' }) {
  const menuItems = [
    { key: 'employees', label: 'Employees' },
    { key: 'absences', label: 'Absence Histories' },
  ];
  const router = useRouter();

  return (
    <Menu
      onClick={({ key }) => router.push(`/${key}`)}
      defaultSelectedKeys={[selectedKey]}
      mode="horizontal"
      items={menuItems}
    />
  );
}

export default MenuComponent;
