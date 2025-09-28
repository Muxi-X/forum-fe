import styled from 'styled-components';
import media from 'styles/media';
import { Tips } from 'styles/tips';

export const EditorPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const EditorWrapper = styled.section`
  flex: 1;
  width: 60%;
  align-self: center;
  max-width: 960px;
  min-width: 375px;
  ${media.phone`width: 100vw`}
`;

export const Header = styled.header`
  display: flex;
  width: 100vw;
  height: auto;
  margin-bottom: 50px;
  .ant-btn-loading-icon {
    display: none;
  }
`;

export const TitleInput = styled.input`
  height: 2em;
  padding: 0.2em 2em;
  line-height: 2em;
  font-size: 28px;
  color: #272727;
  outline: none;
  border: none;
  flex: 7;

  &::placeholder {
    color: #b0aaaa;
  }
`;

export const RightBox = styled.section`
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex: 2;
  height: auto;
  background-color: white;

  &::before {
    content: attr(data-save);
    position: absolute;
    left: -100%;
    color: #b0aaaa;
    font-size: 1em;
    width: fit-content;
  }
`;

export const ToggleEditor = styled.div`
  padding: 0.2em;
  height: 100%;
  height: 1.5em;
  &:hover {
    background-color: #d1d1d1;
  }
  ${Tips}
  cursor: pointer;
`;

export const ItemWrapper = styled.div`
  position: relative;

  #tool {
    position: absolute;
    left: 425px;
  }

  #tool.reset-tags {
    top: 0;
  }

  #tool.generate-summary {
    top: 68px;
  }
`;
