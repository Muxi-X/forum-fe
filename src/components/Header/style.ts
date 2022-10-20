import styled from 'styled-components';
import { color } from 'styles/global';
import media from 'styles/media';

interface StyleProps {
  show: boolean;
}

export const LayoutHeader = styled.div`
  position: relative;
  height: 5rem;
`;

export const HeaderCard = styled.div<StyleProps>`
  position: fixed;
  background-color: ${color};
  overflow: hidden;
  border: none;
  z-index: 10;
  height: 5rem;
  transform: translateZ(0);
  top: 0;
  left: 0;
  right: 0;
  transition: all 0.3s;
  transform: ${(props) =>
    props.show ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)'};
  display: flex;
  justify-content: center;
`;

export const Wrapper = styled.div`
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  max-width: 1440px;
`;

export const LogoDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.9em;
  cursor: pointer;
  color: black;
  width: 20%;

  img {
    height: 1.8em;
    width: auto;
    margin-right: 10px;
  }

  .logo {
    ${media.desktop`display: none`}
  }

  .anticon {
    display: none;
    ${media.desktop`display: inline-block`};
  }
`;

export const SearchDiv = styled.div`
  width: 50%;
  position: relative;

  &::after {
    content: '';
    height: 1.5em;
    width: 1.5em;
    background-image: url('http://ossforum.muxixyz.com/default/search.png');
    background-size: cover;
    position: absolute;
    right: 1em;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    ${media.phone`background-image: url('')`}
  }

  & > input {
    padding-left: 1em;
    font-size: 14px;
    border-radius: 999px;
    background-color: rgb(248, 237, 205);
    height: 2.5em;
    position: relative;
    width: 100%;

    :focus {
      border: 1px solid rgba(255, 171, 0, 1);
    }
  }
`;

export const ToolDiv = styled.div`
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

export const MsgTool = styled.div`
  position: relative;
  height: 2em;
  width: auto;
  display: flex;
  justify-content: space-around;
  width: 30%;

  .ant-badge {
    height: 100%;
    width: auto;
  }

  img {
    cursor: pointer;
    height: 90%;
    width: auto;
  }
  ${media.desktop`display: none`}
`;

export const PostButton = styled.button`
  background-color: rgb(39, 51, 56);
  width: fit-content;
  padding: 0.5em 2em;
  border-radius: 8px;
  cursor: pointer;
  color: white;

  ${media.desktop`display: none`}

  :hover {
    background-color: rgb(39, 51, 56, 0.8);
  }
`;
