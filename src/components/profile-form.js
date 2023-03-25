const {
  Form, Input, Button, Avatar, Row,
} = require('antd');

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const formTailLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 8,
    offset: 4,
  },
};

function ProfileForm({ onFinish, user }) {
  const [form] = Form.useForm();
  const imageUri = Form.useWatch('imageUri', form);

  return (
    <Form
      form={form}
      name="dynamic_rule"
      style={{ maxWidth: 600 }}
      onFinish={onFinish}
      initialValues={{
        email: user?.email,
        password: user?.password,
        name: user?.name,
        phone: user?.phone,
        position: user?.position,
        imageUri: user?.imageUri,
      }}
    >
      <Form.Item
        {...formItemLayout}
        name="email"
        label="Email"
        rules={[{ required: true, type: 'email', message: 'Please input your email' }]}
      >
        <Input placeholder="Please input your email" type="email" />
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Please input your existing or new password' }]}
      >
        <Input.Password placeholder="Please input your password" type="password" />
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        name="name"
        label="Name"
        rules={[{
          required: true, type: 'string', max: 100, message: 'Please input your name',
        }]}
      >
        <Input placeholder="Please input your name" type="name" />
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        name="phone"
        label="Phone Number"
        rules={[{
          required: true, type: 'string', max: 20, message: 'Please input your phone number',
        }]}
      >
        <Input placeholder="Please input your phone number" type="tel" />
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        name="position"
        label="Job Position"
        rules={[{
          required: true, type: 'string', max: 100, message: 'Please input your job position',
        }]}
      >
        <Input placeholder="Please input your job position" />
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        name="imageUri"
        label="Image URL"
        rules={[{ type: 'url' }]}
      >
        <Input placeholder="Please input an image URL" />
      </Form.Item>
      <Row span={8} justify="end">
        <Avatar size={128} src={imageUri} />
      </Row>
      <Form.Item {...formTailLayout}>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!form.isFieldsTouched()}
        >
          Save
        </Button>
      </Form.Item>
    </Form>
  );
}

export default ProfileForm;
