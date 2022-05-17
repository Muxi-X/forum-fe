import React from 'react';
import { useNavigate } from 'react-router';
import useForm from 'hooks/useForm';
import Button from 'components/Button/button';
import { PwdInput, UserInput } from '../styles/pageStyles/login';

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [form, setForm] = useForm<LoginForm>({ username: '', password: '' });
  const nav = useNavigate();
  const handleLogin = () => {
    nav('/');
  };

  const handleMuxi = () => {
    const landing = `${window.location.host}/login`;
    window.location.href = `http://pass.muxi-tech.xyz/#/login_auth?landing=${landing}&client_id=51f03389-2a18-4941-ba73-c85d08201d42`;
  };

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
      <Button onClick={handleLogin}>登陆</Button>
      <button onClick={handleMuxi}>木犀维修工点我登陆</button>
    </>
  );
};

export default Login;
