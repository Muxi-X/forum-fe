import React, { useState } from 'react';
import styled from 'styled-components';
import MdEditor from '../components/Editor/MdEditor';
import RtfEditor from '../components/Editor/RtfEditor';
import Tips from '../styles/tips';
import debounce from '../utils/debounce';

const Header = styled.header`
  display: flex;
  width: 100vw;
  height: auto;
`;

const TitleInput = styled.input`
  width: 100vw;
  height: 2em;
  padding: 0.2em 2em;
  line-height: 2em;
  font-size: 28px;
  color: #272727;
  outline: none;
  border: none;
  flex: 6;

  &::placeholder {
    color: #b0aaaa;
  }
`;

const RightBox = styled.section`
  flex: 1;
  height: auto;
`;

const Button = styled.button`
  cursor: pointer;
  ${Tips}
`;

const Posting: React.FC = () => {
  const [editorType, setEditorType] = useState<'md' | 'rtf'>('rtf');
  // 防抖处理
  const SelectEditor = debounce(() => {
    editorType == 'rtf' ? setEditorType('md') : setEditorType('rtf');
  }, 500);
  return (
    <>
      <Header>
        <TitleInput placeholder="请输入文章标题..." />
        <RightBox>
          <Button
            data-tip={`切换成${editorType == 'md' ? 'rtf' : 'md'}编辑器`}
            onClick={SelectEditor}
          >
            {`${editorType}`.toLocaleUpperCase()}
          </Button>
        </RightBox>
      </Header>
      {editorType === 'rtf' ? <RtfEditor /> : <MdEditor />}
    </>
  );
};

export default Posting;
