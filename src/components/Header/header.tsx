import React, { useEffect, useState } from 'react';
import { Badge, Tooltip, Popover, Modal } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import useList from 'store/useList';
import useProfile from 'store/useProfile';
import logo from 'assets/image/logo1.png';
import chat from 'assets/image/msg.png';
import msgtip from 'assets/image/tip.png';
import useRequest from 'hooks/useRequest';
import Avatar from 'components/Avatar/avatar';
import useWS from 'store/useWS';
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
  const [query, setQuery] = useState('');
  const [draftId, setDraftId] = useState(new Date().getTime());
  const [show, setShow] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nav = useNavigate();
  const {
    userProfile: { avatar, id },
  } = useProfile();
  const { tip } = useWS();

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleOk = () => {
    nav('/login');
    localStorage.clear();
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
            <style.LogoDiv>
              <Link to="/">
                <img src={logo} alt="logo" />
                <span className="logo">MUXI</span>
              </Link>
              <Popover
                trigger="click"
                content={
                  <>
                    <MenuAction>投稿</MenuAction>
                    <MenuAction>查看私信</MenuAction>
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
                placeholder="输入感兴趣的内容哦 :D"
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
                    <Badge count={tip ? 1 : 0} dot>
                      <img src={chat} alt="msg" />
                    </Badge>
                  </Link>
                </Tooltip>
                <Tooltip color="gold" title={'你有新的通知还未查看！'}>
                  <Link to="/">
                    <Badge count={1} dot>
                      <img src={msgtip} alt="tip" />
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
        <p>确认要离开吗QAQ 呜呜呜李劲哲这样的男同舍不得你QAQ</p>
      </Modal>
    </>
  );
};

export default Header;
