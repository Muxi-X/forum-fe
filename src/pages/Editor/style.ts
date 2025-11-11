import styled from 'styled-components';
import media from 'styles/media';
import { Tips } from 'styles/tips';

export const EditorPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;

  ${media.tablet`
    padding: 0 12px;
  `}

  ${media.phone`
    padding: 0 8px;
  `}
`;

export const EditorWrapper = styled.section`
  flex: 1;
  width: 60%;
  align-self: center;
  max-width: 960px;
  min-width: 375px;

  ${media.desktop`
    width: 70%;
  `}

  ${media.tablet`
    width: 90%;
  `}

  ${media.phone`
    width: 100vw;
    padding: 0 8px;
    min-width: auto;
  `}
`;

export const Header = styled.header`
  display: flex;
  width: 100vw;
  height: auto;
  margin-bottom: 50px;
  .ant-btn-loading-icon {
    display: none;
  }

  ${media.tablet`
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
    width: 100%;
  `}

  ${media.phone`
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
    width: 100%;
  `}
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

  ${media.tablet`
    font-size: 22px;
    padding: 0.2em 1.2em;
    width: 100%;
  `}

  ${media.phone`
    font-size: 18px;
    padding: 0.2em 1em;
    width: 100%;
  `}
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

  ${media.tablet`
    width: 100%;
    justify-content: flex-end;
    gap: 8px;
    background-color: transparent;
    padding-right: 12px;
    &::before {
      position: static;
      left: auto;
      display: block;
      margin-bottom: 4px;
    }
  `}

  ${media.phone`
    width: 100%;
    justify-content: flex-start;
    gap: 8px;
    background-color: transparent;
    &::before {
      position: static;
      left: auto;
      display: block;
      margin-bottom: 4px;
    }
  `}
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

  ${media.phone`
    padding: 0.3em; 
    height: 1.8em;
  `}
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

  ${media.tablet`
    #tool {
      position: static;
      left: auto;
      margin-left: 8px;
      margin-top: 8px;
      display: inline-block;
    }
    #tool.reset-tags { 
      top: auto; 
    }
    #tool.generate-summary { 
      top: auto; 
    }
  `}

  ${media.phone`
    #tool {
      position: static;
      left: auto;
      margin-left: 6px;
      margin-top: 6px;
      display: inline-block;
    }
    #tool.reset-tags { 
      top: auto; 
    }
    #tool.generate-summary { 
      top: auto; 
    }
  `}
`;
