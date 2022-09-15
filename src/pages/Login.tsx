import React, { useEffect } from 'react';
import styled from 'styled-components';
import { message } from 'antd';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import useRequest from 'hooks/useRequest';
import useForm from 'hooks/useForm';
import Card from 'components/Card/card';

interface LoginState {
  student_id: string;
  password: string;
}

type loginInfo = 'id' | 'pwd';

const WelcomeTitle = styled.h1`
  color: white;
  font-size: 3rem;
  font-weight: bolder;
`;

const LoginPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #5995fd;
`;

const LoginCard = styled(Card)`
  height: auto;
  width: 40vw;
  min-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const InputField = styled.div`
  max-width: 380px;
  width: 100%;
  background-color: #f0f0f0;
  margin: 10px 0;
  height: 55px;
  border-radius: 55px;
  display: grid;
  grid-template-columns: 15% 85%;
  padding: 0 0.4rem;
  position: relative;

  i {
    text-align: center;
    line-height: 55px;
    color: #acacac;
    font-size: 1.1rem;
  }
`;

const LoginInput = styled.input`
  background: 0;
  outline: 0;
  border: 0;
  line-height: 1;
  font-weight: 600;
  font-size: 1rem;
  color: #333;
`;

const LoginButtons = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 380px;
  width: 100%;
`;

const LoginButton = styled.button`
  width: 150px;
  background-color: #5995fd;
  border: 0;
  outline: 0;
  height: 49px;
  border-radius: 49px;
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px 0;
  cursor: pointer;
  &:hover {
    background-color: #8bb2f6;
  }
`;

const Login: React.FC = () => {
  const [form, setForm] = useForm<LoginState>({ student_id: '', password: '' });
  const [searchParams] = useSearchParams();
  const nav = useNavigate();

  const successLogin = (res: API.auth.postStudent.Response) => {
    if (res.code === 0) {
      message.success('登录成功');
      nav('/');
    }
  };

  const failLogin = (res: ErrorRes) => {
    if (res.code === 10101) {
      message.error('用户不存在');
    } else if (res.code === 20102) {
      message.error('密码错误');
    } else {
      message.error('网络错误');
    }
  };

  const options = {
    onSuccess: successLogin,
    onError: failLogin,
    manual: true,
  };

  const { run } = useRequest(API.auth.postStudent.request, options);

  const { run: runTeam } = useRequest(API.auth.postTeam.request, options);

  const oauth_code = searchParams.get('accessCode');

  useEffect(() => {
    if (oauth_code) {
      runTeam({}, { oauth_code });
    }
  }, []);

  const handleMuxierLogin = () => {
    const landing = `${window.location.host}/login`;
    window.location.href = `http://pass.muxi-tech.xyz/#/login_auth?landing=${landing}&client_id=51f03389-2a18-4941-ba73-c85d08201d42`;
  };

  const handleUserLogin = (val: string, type: loginInfo) => {
    if (type === 'id') setForm({ student_id: val });
    else setForm({ password: val });
  };

  const handleLogin = () => {
    const { student_id, password } = form;
    run({}, { student_id, password });
  };

  return (
    <LoginPage
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleLogin();
      }}
    >
      <WelcomeTitle>Welcome to Muxi-Forum</WelcomeTitle>
      <LoginCard>
        <InputField>
          <i className="fa fa-user" aria-hidden={true} />
          <LoginInput
            onChange={(e) => {
              handleUserLogin(e.target.value, 'id');
            }}
            placeholder="学号"
          />
        </InputField>
        <InputField>
          <i className="fa fa-lock" aria-hidden={true} />
          <LoginInput
            onChange={(e) => {
              handleUserLogin(e.target.value, 'pwd');
            }}
            type="password"
            placeholder="密码"
          />
        </InputField>
        <LoginButtons>
          <LoginButton onClick={handleLogin}>Login</LoginButton>
          <LoginButton onClick={handleMuxierLogin}>维修工</LoginButton>
        </LoginButtons>
      </LoginCard>
    </LoginPage>
  );
};

export default Login;
