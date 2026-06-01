import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import UploadField from '../components/UploadField';
import { mobilePalette, PrimaryButton } from '../styles';
import { mobileApi } from '../api';

const Wrap = styled.div`
  min-height: calc(100vh - 52px);
  padding: 18px 16px 28px;
  background: ${mobilePalette.paper};

  .ant-input,
  .ant-input-affix-wrapper {
    border-radius: 8px;
    border-color: #dfe3ea;
  }
`;

const Label = styled.label`
  display: block;
  margin: 18px 0 14px;
  color: #1a202c;
  font-weight: 700;
`;

const TypeGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 14px;
`;

const TypeChip = styled.button<{ active: boolean }>`
  min-width: 86px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 14px;
  background: ${(props) => (props.active ? '#fff8e1' : '#fff')};
  border: 1px solid ${(props) => (props.active ? '#ffc641' : '#e6e6e6')};
  color: ${(props) => (props.active ? '#fe9800' : '#7f838a')};
`;

const Feedback: React.FC = () => {
  const nav = useNavigate();
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [img, setImg] = useState('');
  const [category, setCategory] = useState('产品改进');

  const submit = async () => {
    if (!content.trim()) {
      message.warning('请填写反馈内容');
      return;
    }
    const res = await mobileApi.feedback({
      category: 'mobile',
      feedback_category: category,
      content,
      contact,
      img_url: img,
    });
    if (res.code !== 0) {
      message.error(res.message);
      return;
    }
    message.success('感谢反馈');
    nav(-1);
  };

  return (
    <MobileShell title="我要反馈" back tabs={false}>
      <Wrap>
        <Label>问题类型*</Label>
        <TypeGrid>
          {['功能异常', '产品改进', '异常设计', '功能建议', '体验问题', '其他问题'].map(
            (item) => (
              <TypeChip
                key={item}
                active={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </TypeChip>
            ),
          )}
        </TypeGrid>
        <Label>问题描述*</Label>
        <Input.TextArea
          rows={5}
          value={content}
          maxLength={200}
          showCount
          placeholder="请详细描述您遇到的问题..."
          onChange={(event) => setContent(event.target.value)}
        />
        <Label>上传图片</Label>
        <UploadField compact iconOnly value={img} onChange={setImg} />
        <Label>联系方式</Label>
        <Input
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          placeholder="QQ/邮箱"
        />
        <PrimaryButton style={{ width: '100%', marginTop: 22 }} onClick={submit}>
          提交
        </PrimaryButton>
      </Wrap>
    </MobileShell>
  );
};

export default Feedback;
