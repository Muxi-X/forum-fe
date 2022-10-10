import React, { useEffect } from 'react';
import { message, Card } from 'antd';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import useRequest from 'hooks/useRequest';
import useForm from 'hooks/useForm';
import useProfile from 'store/useProfile';
import useWS from 'store/useWS';
import WS from 'utils/WS';
import styled from 'styled-components';
import * as style from './style';
import ResultPage from 'pages/Result';

interface LoginState {
  student_id: string;
  password: string;
}

type loginInfo = 'id' | 'pwd';

const LoginCard = styled(Card)`
  height: auto;
  width: 40vw;
  min-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Login: React.FC = () => {
  const [form, setForm] = useForm<LoginState>({ student_id: '', password: '' });
  const [searchParams] = useSearchParams();
  const { setUser, setToken } = useProfile();
  const { setTip, setWS } = useWS();

  const nav = useNavigate();

  const { runAsync: getUser } = useRequest(API.user.getUserMyprofile.request, {
    manual: true,
  });

  const { runAsync: getQiniuToken } = useRequest(API.post.getPostQiniu_token.request, {
    manual: true,
  });

  const webSocketInit = () => {
    const token = localStorage.getItem('token') as string;
    const WebSocket = new WS(token);
    WebSocket.ws.onmessage = () => {
      setTip(true);
    };
    setWS(WebSocket);
  };

  const initUser = async () => {
    const user = await getUser({});
    setUser(user.data);
    const qiniu = await getQiniuToken({});
    setToken(qiniu.data.token as string);
    webSocketInit();
  };

  const successLogin = (res: API.auth.postStudent.Response) => {
    if (res.code === 0) {
      message.success('登录成功');
      localStorage.setItem('token', res.data.token as string);
      initUser();
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
    <>
      {!oauth_code ? (
        <style.LoginPage
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleLogin();
          }}
        >
          <style.WelcomeTitle>Welcome to Muxi-Forum</style.WelcomeTitle>
          <LoginCard>
            <style.InputField>
              <i className="fa fa-user" aria-hidden={true} />
              <style.LoginInput
                onChange={(e) => {
                  handleUserLogin(e.target.value, 'id');
                }}
                placeholder="学号"
              />
            </style.InputField>
            <style.InputField>
              <i className="fa fa-lock" aria-hidden={true} />
              <style.LoginInput
                onChange={(e) => {
                  handleUserLogin(e.target.value, 'pwd');
                }}
                type="password"
                placeholder="密码"
              />
            </style.InputField>
            <style.LoginButtons>
              <style.LoginButton onClick={handleLogin}>Login</style.LoginButton>
              <style.LoginButton onClick={handleMuxierLogin}>维修工</style.LoginButton>
            </style.LoginButtons>
          </LoginCard>
        </style.LoginPage>
      ) : (
        <ResultPage type="login" />
      )}
    </>
  );
};

export default Login;
