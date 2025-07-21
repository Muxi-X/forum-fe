import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import useRequest from 'hooks/useRequest';
import useForm from 'hooks/useForm';
import useDocTitle from 'hooks/useDocTitle';
import useProfile from 'store/useProfile';
import useWS from 'store/useWS';
import WS from 'utils/WS';
import ResultPage from 'pages/Result';
import './index.less';

interface LoginState {
  student_id: string;
  password: string;
}

type loginInfo = 'id' | 'pwd';

const Login: React.FC = () => {
  const initId = localStorage.getItem('id');
  const initPwd = localStorage.getItem('pwd');
  const [form, setForm] = useForm<LoginState>({
    student_id: initId ? initId : '',
    password: initPwd ? initPwd : '',
  });
  const [isMuxi, setIsMuxi] = useState(false);
  const [searchParams] = useSearchParams();
  const { setUser, setToken } = useProfile();
  const { setTip, setWS } = useWS();

  useDocTitle(`惠然之顾 - 茶馆`);

  const { student_id, password } = form;

  const nav = useNavigate();

  const { runAsync: getUser } = useRequest(API.user.getUserMyprofile.request, {
    manual: true,
    onSuccess: (res) => {
      setUser(res.data);
    },
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

  const successLogin = async (res: API.auth.postStudent.Response) => {
    if (res.code === 0) {
      message.success('登录成功');
      localStorage.setItem('token', res.data.token as string);
      localStorage.setItem('id', student_id);
      localStorage.setItem('pwd', password);
      const user = await getUser({});
      setUser(user.data);
      if (user.data.id !== undefined) {
        localStorage.setItem('userId', user.data.id.toString());
      }
      const qiniu = await getQiniuToken({});
      setToken(qiniu.data.token as string);
      webSocketInit();
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

  const handleLoginRole = () => {
    setIsMuxi(!isMuxi);
  };

  return (
    <div className="login-page">
      {!oauth_code ? (
        <div
          aria-hidden
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleLogin();
            }
          }}
          className={`container ${isMuxi ? 'sign-up-mode' : ''} `}
        >
          <div className="forms-container">
            <div className="signin-signup">
              <section className="sign-in-form">
                <h2 className="title">登录</h2>
                <div className="input-field">
                  <i className="fa fa-user"></i>
                  <input
                    value={student_id}
                    onChange={(e) => {
                      handleUserLogin(e.target.value, 'id');
                    }}
                    type="text"
                    placeholder="学号"
                  />
                </div>
                <div className="input-field">
                  <i className="fa fa-lock"></i>
                  <input
                    value={password}
                    onChange={(e) => {
                      handleUserLogin(e.target.value, 'pwd');
                    }}
                    type="password"
                    placeholder="密码"
                  />
                </div>
                <input
                  onClick={handleLogin}
                  type="submit"
                  value="立即登录"
                  className="btn solid"
                />
              </section>
              <section className="sign-up-form">
                <button onClick={handleMuxierLogin} type="submit" className="btn">
                  木犀通行证
                </button>
              </section>
            </div>
          </div>

          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content">
                <h3>MUXI</h3>
                <p>木犀维修工通道</p>
                <button
                  onClick={handleLoginRole}
                  className="btn transparent"
                  id="sign-up-btn"
                >
                  go
                </button>
              </div>
              <img
                src="https://ossforum.muxixyz.com/default/log.svg"
                className="image"
                alt=""
              />
            </div>
            <div className="panel right-panel">
              <div className="content">
                <h3>CCNU</h3>
                <p>使用已有学号登录</p>
                <button
                  onClick={handleLoginRole}
                  className="btn transparent"
                  id="sign-in-btn"
                >
                  GO
                </button>
              </div>
              <img
                src="https://ossforum.muxixyz.com/default/register.svg"
                className="image"
                alt=""
              />
            </div>
          </div>
        </div>
      ) : (
        <ResultPage type="login" />
      )}
    </div>
  );
};

export default Login;
