import React, { useEffect, useState } from 'react';
import { Badge, Tooltip, Popover, Modal } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import useChat from 'store/useChat';
import useList from 'store/useList';
import useProfile from 'store/useProfile';
import Avatar from 'components/Avatar/avatar';
import useWS from 'store/useWS';
import useNotification from 'store/useNotification';
import * as style from './style';

const HeaderAvatar = styled(Avatar)`
  height: 3rem;
  width: 3rem;
`;

const MenuAction = styled.div`
  font-size: 1rem;
  color: rgb(255 208 4);
  cursor: pointer;
  user-select: none;
`;

const Header: React.FC = () => {
  const { setSelectedId, setContacts } = useChat();
  const [searchParams] = useSearchParams();
  const value = searchParams.get('query');
  const [query, setQuery] = useState(value ? value : '');
  const [draftId, setDraftId] = useState(new Date().getTime());
  const [show, setShow] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nav = useNavigate();
  const {
    userProfile: { avatar, id },
  } = useProfile();
  const { ws, tip } = useWS();
  const { setList } = useList();
  const { setTip } = useWS();
  const { unreadCount } = useNotification();

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleOk = () => {
    ws?.close();
    setContacts([]);
    setSelectedId(0);
    localStorage.removeItem('token');
    nav('/login');
  };

  const handleSearch = () => {
    nav(`/search?query=${query}`);
  };

  useEffect(() => {
    let Before_scollH = 0;
    const hander = () => {
      let After_scollH = document.documentElement.scrollTop;
      let differH = After_scollH - Before_scollH;
      if (differH === 0) {
        return false;
      }
      const scollType = differH > 0 ? 'down' : 'up';
      if (scollType === 'down' && differH > 60) {
        Before_scollH = After_scollH;
        setShow(false);
      } else if (scollType === 'up') {
        Before_scollH = After_scollH;
        setShow(true);
      }
    };
    window.addEventListener('scroll', hander);
    return () => {
      window.removeEventListener('scroll', hander);
    };
  }, []);

  return (
    <>
      <style.LayoutHeader>
        <style.HeaderCard show={show}>
          <style.Wrapper>
            <style.LogoDiv
              onClick={() => {
                if (location.href.slice(0, -1) === location.origin) return;
                nav('/');
                setList([]);
                setQuery('');
              }}
            >
              <img src="https://ossforum.muxixyz.com/logo1.png" alt="logo" />
              <span className="logo">MUXI</span>
              <Popover
                trigger="click"
                content={
                  <>
                    <MenuAction
                      onClick={(e) => {
                        e.stopPropagation();
                        setDraftId(new Date().getTime());
                        nav(`/editor/article${draftId}`);
                      }}
                    >
                      投稿
                    </MenuAction>
                    <MenuAction
                      onClick={(e) => {
                        e.stopPropagation();
                        nav('/user/chat');
                      }}
                    >
                      查看私信
                    </MenuAction>
                    <MenuAction>查看通知</MenuAction>
                  </>
                }
              >
                <MenuOutlined />
              </Popover>
            </style.LogoDiv>
            <style.SearchDiv
              onClick={() => {
                if (!query) return;
                handleSearch();
              }}
            >
              <input
                onKeyDown={(e) => {
                  if (!query) return;
                  if (e.key === 'Enter') handleSearch();
                }}
                onChange={handleQueryChange}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                value={query}
                placeholder="输入感兴趣的内容哦"
              />
            </style.SearchDiv>
            <style.ToolDiv>
              <Popover
                content={
                  <MenuAction
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  >
                    退出登陆
                  </MenuAction>
                }
              >
                <div>
                  <HeaderAvatar src={avatar as string} userId={id} />
                </div>
              </Popover>
              <style.MsgTool>
                <Tooltip
                  color="gold"
                  title={tip ? '有人给你发消息还没回哦  ❤️' : '去找人唠唠嗑吧 ~'}
                >
                  <Link to="/user/chat">
                    <Badge count={tip ? 1 : 0}>
                      <img
                        aria-hidden
                        onClick={() => {
                          setTip(false);
                        }}
                        src="https://ossforum.muxixyz.com/default/msg.png"
                        alt="msg"
                      />
                    </Badge>
                  </Link>
                </Tooltip>
                <Tooltip color="gold" title={'查看通知'}>
                  <Link to="/notice">
                    <Badge count={unreadCount}>
                      <img src="https://ossforum.muxixyz.com/default/tip.png" alt="tip" />
                    </Badge>
                  </Link>
                </Tooltip>
              </style.MsgTool>
              <Link to={`/editor/article${draftId}`}>
                <style.PostButton
                  onClick={() => {
                    setDraftId(new Date().getTime());
                  }}
                >
                  我要投稿
                </style.PostButton>
              </Link>
            </style.ToolDiv>
          </style.Wrapper>
        </style.HeaderCard>
      </style.LayoutHeader>
      <Modal
        centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        okText="确认"
        cancelText="取消"
      >
        <p>真的要离开吗，我们会失去一个很好的表达者</p>
      </Modal>
    </>
  );
};

export default Header;
