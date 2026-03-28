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

interface StudentLoginFlowState {
  token?: string;
  session_id?: string;
  status?: string;
  message?: string;
  captcha_image_base64?: string;
  available_second_auth_methods?: string[];
  current_second_auth_method?: string;
  second_auth_sms_target?: string;
  second_auth_email_target?: string;
}

type LoginInfo = 'id' | 'pwd';
type SecondAuthMethod = 'sms' | 'email';
type StudentLoginAction = 'start' | 'captcha' | 'second_auth_send' | 'second_auth_verify' | '';

const secondAuthCopy: Record<
  SecondAuthMethod,
  { label: string; sendLabel: string; resendLabel: string }
> = {
  sms: {
    label: '短信',
    sendLabel: '发送短信码',
    resendLabel: '重发短信码',
  },
  email: {
    label: '邮箱',
    sendLabel: '发送邮箱码',
    resendLabel: '重发邮箱码',
  },
};

const isSecondAuthMethod = (value?: string): value is SecondAuthMethod =>
  value === 'sms' || value === 'email';

const getSecondAuthTarget = (
  loginFlow: StudentLoginFlowState | null,
  method: SecondAuthMethod,
) => {
  if (method === 'sms') {
    return loginFlow?.second_auth_sms_target || '';
  }
  return loginFlow?.second_auth_email_target || '';
};

const getSecondAuthOptionTarget = (
  loginFlow: StudentLoginFlowState | null,
  method: SecondAuthMethod,
) => {
  return getSecondAuthTarget(loginFlow, method);
};

const simplifyFlowMessage = (status: string, rawMessage?: string) => {
  const messageText = rawMessage?.trim() || '';
  if (!messageText) return '';

  if (status === 'need_captcha') {
    if (messageText.includes('OCR')) return '识别失败，改为手动输入';
    if (messageText === '请输入验证码后继续登录。') return '';
  }

  if (status === 'need_second_auth_method') {
    if (messageText === '已进入二次认证，请选择认证方式。') return '';
  }

  if (status === 'need_second_auth_code' && messageText.includes('已发送')) {
    return '';
  }

  return messageText;
};

const Login: React.FC = () => {
  const initId = localStorage.getItem('id');
  const initPwd = localStorage.getItem('pwd');
  const [form, setForm] = useForm<LoginState>({
    student_id: initId ? initId : '',
    password: initPwd ? initPwd : '',
  });
  const [captcha, setCaptcha] = useState('');
  const [secondAuthCode, setSecondAuthCode] = useState('');
  const [secondAuthMethod, setSecondAuthMethod] = useState<SecondAuthMethod>('sms');
  const [loginFlow, setLoginFlow] = useState<StudentLoginFlowState | null>(null);
  const [pendingAction, setPendingAction] = useState<StudentLoginAction>('');
  const [isMuxi, setIsMuxi] = useState(false);
  const [searchParams] = useSearchParams();
  const { setUser, setToken } = useProfile();
  const { setTip, setWS } = useWS();

  useDocTitle(`惠然之顾 - 茶馆`);

  const { student_id, password } = form;
  const loginStatus = loginFlow?.status || '';
  const currentSessionId = loginFlow?.session_id || '';
  const availableMethods = (loginFlow?.available_second_auth_methods || []).filter(
    isSecondAuthMethod,
  );
  const showCaptchaFlow = loginStatus === 'need_captcha';
  const showSecondAuthFlow =
    loginStatus === 'need_second_auth_method' || loginStatus === 'need_second_auth_code';
  const showSecondAuthCodeInput = loginStatus === 'need_second_auth_code';
  const currentSecondAuthMethod = loginFlow?.current_second_auth_method;
  const serverSecondAuthMethod = isSecondAuthMethod(currentSecondAuthMethod)
    ? currentSecondAuthMethod
    : undefined;
  const currentMethodMeta = secondAuthCopy[secondAuthMethod];
  const currentSecondAuthTarget = getSecondAuthTarget(loginFlow, secondAuthMethod);
  const selectedMethodNeedsSend =
    showSecondAuthFlow &&
    (!showSecondAuthCodeInput || !serverSecondAuthMethod || secondAuthMethod !== serverSecondAuthMethod);
  const secondAuthStepLabel = 'STEP 2';
  const canVerifySecondAuth =
    showSecondAuthCodeInput &&
    !!serverSecondAuthMethod &&
    secondAuthMethod === serverSecondAuthMethod &&
    !!secondAuthCode.trim();
  const flowStatusText = simplifyFlowMessage(loginStatus, loginFlow?.message);
  const captchaImageSrc = loginFlow?.captcha_image_base64
    ? `data:image/jpeg;base64,${loginFlow.captcha_image_base64}`
    : '';
  const isSendingSecondAuthCode = pendingAction === 'second_auth_send';
  const isVerifyingSecondAuthCode = pendingAction === 'second_auth_verify';
  const isSubmittingCaptcha = pendingAction === 'captcha';
  const isRefreshingCaptcha = pendingAction === 'start' && showCaptchaFlow;
  const isSecondAuthBusy = isSendingSecondAuthCode || isVerifyingSecondAuthCode;

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
    if (WebSocket.ws) {
      WebSocket.ws.onmessage = () => {
        setTip(true);
      };
      setWS(WebSocket);
    }
  };

  const finishLogin = async (token: string) => {
    message.success('登录成功');
    localStorage.setItem('token', token);
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
  };

  const handleStudentLoginResponse = async (res: API.auth.postStudent.Response) => {
    setPendingAction('');
    if (res.code !== 0) return;

    const data = res.data as StudentLoginFlowState;
    if (data.status && data.status !== 'logged_in') {
      setLoginFlow(data);
      if (isSecondAuthMethod(data.current_second_auth_method)) {
        setSecondAuthMethod(data.current_second_auth_method);
      } else if (data.available_second_auth_methods?.some(isSecondAuthMethod)) {
        setSecondAuthMethod(
          data.available_second_auth_methods.find(isSecondAuthMethod) as SecondAuthMethod,
        );
      }
      if (data.status !== 'need_captcha') {
        setCaptcha('');
      }
      if (data.status !== 'need_second_auth_code') {
        setSecondAuthCode('');
      }
      return;
    }

    if (data.token) {
      setLoginFlow(null);
      setCaptcha('');
      setSecondAuthCode('');
      await finishLogin(data.token);
      return;
    }

    message.error('登录流程异常，请稍后重试');
  };

  const handleTeamLoginResponse = async (res: API.auth.postTeam.Response) => {
    if (res.code === 0 && res.data.token) {
      await finishLogin(res.data.token);
    }
  };

  const failLogin = (res: ErrorRes) => {
    setPendingAction('');
    if (res.code === 10101) {
      message.error('用户不存在');
    } else if (res.code === 20102) {
      message.error('密码错误');
    } else {
      message.error(res.message || '网络错误');
    }
  };

  const { run: runStudent, loading: studentActionLoading } = useRequest(API.auth.postStudent.request, {
    onSuccess: handleStudentLoginResponse,
    onError: failLogin,
    manual: true,
  });

  const { run: runTeam } = useRequest(API.auth.postTeam.request, {
    onSuccess: handleTeamLoginResponse,
    onError: failLogin,
    manual: true,
  });

  const oauth_code = searchParams.get('accessCode');
  useEffect(() => {
    if (oauth_code) {
      runTeam({}, { oauth_code });
    }
  }, [oauth_code]);

  const handleMuxierLogin = () => {
    const landing = `${window.location.host}/login`;
    window.location.href = `https://pass.muxixyz.com/#/login_auth?landing=${landing}&client_id=51f03389-2a18-4941-ba73-c85d08201d42`;
  };

  const handleUserLogin = (val: string, type: LoginInfo) => {
    if (type === 'id') setForm({ student_id: val });
    else setForm({ password: val });
  };

  const submitStudentAction = (
    action: StudentLoginAction,
    extra: Partial<defs.StudentLoginRequest> = {},
  ) => {
    setPendingAction(action);
    runStudent(
      {},
      {
        student_id,
        password,
        action,
        session_id: currentSessionId,
        ...extra,
      },
    );
  };

  const handleLogin = () => {
    if (studentActionLoading) return;
    if (!student_id || !password) {
      message.warning('请先输入学号和密码');
      return;
    }
    setLoginFlow(null);
    setCaptcha('');
    setSecondAuthCode('');
    setSecondAuthMethod('sms');
    submitStudentAction('start');
  };

  const handleResetFlow = () => {
    if (studentActionLoading) return;
    setLoginFlow(null);
    setCaptcha('');
    setSecondAuthCode('');
    setSecondAuthMethod('sms');
  };

  const handleSubmitCaptcha = () => {
    if (studentActionLoading) return;
    if (!captcha.trim()) {
      message.warning('请输入验证码');
      return;
    }
    submitStudentAction('captcha', { captcha: captcha.trim() });
  };

  const handleRefreshCaptcha = () => {
    if (studentActionLoading) return;
    if (!student_id || !password) {
      message.warning('请先输入学号和密码');
      return;
    }
    setCaptcha('');
    submitStudentAction('start');
  };

  const handleSendSecondAuthCode = () => {
    if (studentActionLoading) return;
    if (!secondAuthMethod) {
      message.warning('请选择二次认证方式');
      return;
    }
    submitStudentAction('second_auth_send', { second_auth_method: secondAuthMethod });
  };

  const handleVerifySecondAuthCode = () => {
    if (studentActionLoading) return;
    if (!secondAuthCode.trim()) {
      message.warning(`请输入${secondAuthMethod === 'email' ? '邮箱' : '短信'}验证码`);
      return;
    }
    submitStudentAction('second_auth_verify', {
      second_auth_code: secondAuthCode.trim(),
    });
  };

  const handleLoginRole = () => {
    if (studentActionLoading) return;
    setIsMuxi(!isMuxi);
  };

  const renderFlowButtonLabel = (
    idleLabel: string,
    loadingLabel: string,
    loading: boolean,
  ) => (
    <span className="flow-btn-content">
      {loading ? <span className="flow-btn-spinner" aria-hidden /> : null}
      <span>{loading ? loadingLabel : idleLabel}</span>
    </span>
  );

  const renderAuthStage = () => {
    if (!showCaptchaFlow && !showSecondAuthFlow) {
      return (
        <div key="credentials" className="auth-stage">
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
          <button onClick={handleLogin} type="button" className="btn solid stage-submit">
            立即登录
          </button>
        </div>
      );
    }

    if (showCaptchaFlow) {
      return (
        <div key="captcha" className="auth-stage flow-stage">
          <div className="flow-head flow-head-plain">
            <button
              onClick={handleResetFlow}
              type="button"
              className="flow-link"
              disabled={studentActionLoading}
            >
              返回登录
            </button>
          </div>
          <h2 className="title flow-title">输入验证码</h2>
          {flowStatusText ? <p className="flow-status">{flowStatusText}</p> : null}
          <div className="flow-card captcha-stage">
            {captchaImageSrc && (
              <div className={`captcha-visual ${isRefreshingCaptcha ? 'refreshing' : ''}`}>
                <div className="captcha-image-shell">
                  <img className="captcha-image" src={captchaImageSrc} alt="验证码" />
                  {isRefreshingCaptcha ? (
                    <span className="captcha-image-loading" aria-hidden>
                      <span className="flow-btn-spinner captcha-spinner" />
                    </span>
                  ) : null}
                </div>
                <button
                  onClick={handleRefreshCaptcha}
                  type="button"
                  className="captcha-refresh"
                  disabled={isRefreshingCaptcha || isSubmittingCaptcha}
                >
                  换一张
                </button>
              </div>
            )}
            <div className="input-field flow-input">
              <i className="fa fa-shield"></i>
              <input
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                type="text"
                placeholder="验证码"
              />
            </div>
            <div className="flow-actions-row">
              <button
                onClick={handleSubmitCaptcha}
                type="button"
                className={`btn flow-btn primary-action ${isSubmittingCaptcha ? 'loading' : ''}`}
                disabled={isSubmittingCaptcha || isRefreshingCaptcha}
              >
                {renderFlowButtonLabel('继续', '提交中', isSubmittingCaptcha)}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="auth-stage flow-stage">
        <div className="flow-head">
          <span className="flow-marker">{secondAuthStepLabel}</span>
          <button
            onClick={handleResetFlow}
            type="button"
            className="flow-link"
            disabled={studentActionLoading}
          >
            返回登录
          </button>
        </div>
        <h2 className="title flow-title">二次验证</h2>
        {flowStatusText ? <p className="flow-status">{flowStatusText}</p> : null}
        <div className="flow-card">
          <div className="method-switcher">
            {(availableMethods.length > 0 ? availableMethods : [secondAuthMethod]).map((method) => (
              <button
                key={method}
                type="button"
                className={`method-tab ${secondAuthMethod === method ? 'active' : ''}`}
                disabled={isSecondAuthBusy}
                onClick={() => {
                  setSecondAuthMethod(method);
                  setSecondAuthCode('');
                }}
              >
                <span className="method-tab-label">{secondAuthCopy[method].label}</span>
                {getSecondAuthOptionTarget(loginFlow, method) ? (
                  <span className="method-tab-target">
                    {getSecondAuthOptionTarget(loginFlow, method)}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          <div className="input-field flow-input">
            <i className="fa fa-key"></i>
            <input
              value={secondAuthCode}
              onChange={(e) => setSecondAuthCode(e.target.value)}
              type="text"
              disabled={isSendingSecondAuthCode}
              placeholder={
                selectedMethodNeedsSend
                  ? `先发送${currentMethodMeta.label}验证码`
                  : `输入${currentMethodMeta.label}验证码`
              }
            />
          </div>
          <div className="flow-actions-row split">
            <button
              onClick={handleSendSecondAuthCode}
              type="button"
              className={`btn flow-btn light-btn ${isSendingSecondAuthCode ? 'loading' : ''}`}
              disabled={isSecondAuthBusy}
            >
              {renderFlowButtonLabel(
                selectedMethodNeedsSend ? currentMethodMeta.sendLabel : currentMethodMeta.resendLabel,
                '发送中',
                isSendingSecondAuthCode,
              )}
            </button>
            <button
              onClick={handleVerifySecondAuthCode}
              type="button"
              className={`btn flow-btn primary-action ${isVerifyingSecondAuthCode ? 'loading' : ''}`}
              disabled={!canVerifySecondAuth || isSecondAuthBusy}
            >
              {renderFlowButtonLabel('验证并登录', '验证中', isVerifyingSecondAuthCode)}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="login-page">
      {!oauth_code ? (
        <div
          aria-hidden
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (studentActionLoading) {
                return;
              }
              if (showCaptchaFlow) {
                handleSubmitCaptcha();
                return;
              }
              if (showSecondAuthFlow) {
                if (showSecondAuthCodeInput) {
                  handleVerifySecondAuthCode();
                } else {
                  handleSendSecondAuthCode();
                }
                return;
              }
              handleLogin();
            }
          }}
          className={`container ${isMuxi ? 'sign-up-mode' : ''} ${
            showCaptchaFlow || showSecondAuthFlow ? 'flow-mode' : ''
          }`}
        >
          <div className="forms-container">
            <div className="signin-signup">
              <section className="sign-in-form">
                {renderAuthStage()}
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
