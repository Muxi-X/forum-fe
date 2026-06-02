import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import UploadField from '../components/UploadField';
import { FloatingSubmitBar, mobileRadius, PrimaryButton } from '../styles';
import { mobileApi } from '../api';

const Wrap = styled.div`
  min-height: calc(100vh - 52px);
  padding: 14px 16px calc(22px + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, #fffaf0 0%, #f7f8fb 38%, #f7f8fb 100%);

  .ant-input,
  .ant-input-affix-wrapper {
    border-radius: ${mobileRadius.lg};
    border-color: rgba(60, 60, 67, 0.1);
    box-shadow: 0 8px 22px rgba(16, 24, 40, 0.04);
  }
`;

const FormCard = styled.section`
  padding: 16px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.74);
  box-shadow: 0 16px 36px rgba(16, 24, 40, 0.06);
  backdrop-filter: blur(18px);
`;

const Label = styled.label`
  display: block;
  margin: 16px 0 9px;
  color: #1a202c;
  font-weight: 700;
  &:first-child {
    margin-top: 0;
  }
`;

const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`;

const TypeChip = styled.button<{ active: boolean }>`
  min-height: 42px;
  padding: 0 12px;
  border-radius: ${mobileRadius.lg};
  background: ${(props) => (props.active ? '#fff8e1' : 'rgba(255, 255, 255, 0.86)')};
  border: 1px solid ${(props) => (props.active ? '#ffc641' : 'rgba(60, 60, 67, 0.1)')};
  color: ${(props) => (props.active ? '#fe9800' : '#7f838a')};
  font-weight: ${(props) => (props.active ? 800 : 500)};
`;

const FixedBar = styled(FloatingSubmitBar)``;

const Feedback: React.FC = () => {
  const nav = useNavigate();
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [img, setImg] = useState('');
  const [category, setCategory] = useState('产品改进');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!content.trim()) {
      message.warning('请填写反馈内容');
      return;
    }
    setSubmitting(true);
    try {
      const res = await mobileApi.feedback({
        category,
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MobileShell title="我要反馈" back tabs={false}>
      <Wrap>
        <FormCard>
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
        </FormCard>
        <FixedBar>
          <PrimaryButton disabled={submitting} onClick={submit}>
            {submitting ? '提交中...' : '提交'}
          </PrimaryButton>
        </FixedBar>
      </Wrap>
    </MobileShell>
  );
};

export default Feedback;
