import React, { useEffect } from 'react';
import useForm from 'hooks/useForm';
import { message, Input, Form, Button, Checkbox } from 'antd';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

interface LoginState {
  student_id: string;
  password: string;
}

const Login: React.FC = () => {
  const [form, setForm] = useForm<LoginState>({ student_id: '', password: '' });
  const [searchParams] = useSearchParams();
  const nav = useNavigate();

  const { data, isLoading } = API.auth.postStudent.useRequest({
    student_id: '22',
    password: '33',
  });

  console.log(data);

  const { student_id, password } = form;
  const accessCode = searchParams.get('accessCode');

  useEffect(() => {
    if (accessCode) {
      // 请求木犀er登陆接口
      nav('/');
    }
  }, []);

  const onFinish = (values: defs.StudentLoginRequest) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleMuxierLogin = () => {
    const landing = `${window.location.host}/login`;
    window.location.href = `http://pass.muxi-tech.xyz/#/login_auth?landing=${landing}&client_id=51f03389-2a18-4941-ba73-c85d08201d42`;
  };
  return (
    <>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Student_id"
          name="student_id"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Button type="primary" onClick={handleMuxierLogin}>
        木犀维修工登陆
      </Button>
    </>
  );
};

export default Login;
