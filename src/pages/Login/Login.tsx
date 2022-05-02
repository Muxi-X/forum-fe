import React from 'react';
import useForm from 'hooks/useForm';
import Button from 'components/Button/button';
import { PwdInput, UserInput } from './style';

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [form, setForm] = useForm<LoginForm>({ username: '', password: '' });
  return (
    <>
      <UserInput
        value={form.username}
        onChange={(e) => setForm('username', e.target.value)}
        placeholder="请输入您的学号"
      />
      <PwdInput
        value={form.password}
        onChange={(e) => {
          setForm('password', e.target.value);
        }}
        placeholder="请输入您的密码"
      />
      <Button>登陆</Button>
    </>
  );
};

export default Login;
