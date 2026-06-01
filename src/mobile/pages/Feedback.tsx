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
  padding: 16px;
  background: ${mobilePalette.paper};
`;

const Label = styled.label`
  display: block;
  margin: 16px 0 8px;
  color: ${mobilePalette.muted};
`;

const Feedback: React.FC = () => {
  const nav = useNavigate();
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [img, setImg] = useState('');

  const submit = async () => {
    if (!content.trim()) {
      message.warning('请填写反馈内容');
      return;
    }
    const res = await mobileApi.feedback({
      category: 'mobile',
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
    <MobileShell title="反馈与建议" back tabs={false}>
      <Wrap>
        <Label>反馈内容</Label>
        <Input.TextArea
          rows={8}
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <Label>联系方式</Label>
        <Input
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          placeholder="可选"
        />
        <Label>图片</Label>
        <UploadField value={img} onChange={setImg} />
        <PrimaryButton style={{ width: '100%', marginTop: 22 }} onClick={submit}>
          提交
        </PrimaryButton>
      </Wrap>
    </MobileShell>
  );
};

export default Feedback;
