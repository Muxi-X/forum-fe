import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, message, Form, Input, Card, Switch } from 'antd';
import { useNavigate } from 'react-router';
import useRequest from 'hooks/useRequest';
import useProfile from 'store/useProfile';
import Avatar from 'components/Avatar/avatar';
import { QiniuServer } from 'config';
import qiniupload, { CompleteRes, observer } from 'utils/qiniup';

const SetCard = styled(Card)`
  position: relative;
  min-height: 300px;
  .ant-card-body {
    display: flex;
  }
  .ant-btn {
    margin-left: 6rem;
  }
`;

const FormWrapper = styled.div`
  display: inline-block;
  width: 70%;
`;

const AvatarWrapper = styled.div`
  display: inline-block;
  width: 30%;
`;

const StyleInput = styled(Input)`
  background: #fafafa;
  :hover {
    background: #e7e7e7;
    input {
      background: #e7e7e7;
    }
  }
`;

const Seting: React.FC = () => {
  const { qiniuToken, userProfile, setUser } = useProfile();
  const { name, avatar, signature, is_public_collection_and_like, is_public_feed } =
    userProfile;
  const [form] = Form.useForm();
  const [tempFile, setTempFile] = useState<File>();
  const [avatarUrl, setAvatarUrl] = useState(avatar);
  const formValues = form.getFieldsValue();
  const nav = useNavigate();
  const { run } = useRequest(API.user.putUser.request, {
    manual: true,
    onSuccess: () => {
      console.log({ ...userProfile, ...formValues, avatar: avatarUrl });
      setUser({ ...userProfile, ...formValues, avatar: avatarUrl });
      message.success('修改成功!');
      nav(`/user/${userProfile.id}`);
    },
  });

  const onFinish = (e: API.user.putUser.Params) => {
    if (tempFile) {
      qiniupload(tempFile as File, qiniuToken);
      observer.complete = (res: CompleteRes) => {
        setAvatarUrl(QiniuServer + res.key);
        run({}, { avatar_url: QiniuServer + res.key, ...e });
      };
    } else {
      run({}, { ...e, avatar_url: avatar });
    }
  };

  return (
    <>
      <SetCard>
        <FormWrapper>
          <Form
            layout="horizontal"
            colon={false}
            wrapperCol={{ span: 12 }}
            labelAlign="left"
            onFinish={onFinish}
            form={form}
            initialValues={{
              name,
              signature,
              is_public_collection_and_like,
              is_public_feed,
            }}
          >
            <Form.Item name="name" label="用户名" labelCol={{ span: 3 }}>
              <StyleInput maxLength={10} showCount />
            </Form.Item>
            <Form.Item name="signature" label="个人介绍" labelCol={{ span: 3 }}>
              <StyleInput maxLength={20} showCount />
            </Form.Item>
            <Form.Item
              valuePropName="checked"
              label="动态隐私"
              name="is_public_feed"
              labelCol={{ span: 3 }}
            >
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>
            <Form.Item
              valuePropName="checked"
              label="喜好隐私"
              name="is_public_collection_and_like"
              labelCol={{ span: 3 }}
            >
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                保存修改
              </Button>
            </Form.Item>
          </Form>
        </FormWrapper>
        <AvatarWrapper>
          <Avatar
            onChange={(file) => {
              setTempFile(file);
            }}
            size={'large'}
            fix
            src={avatar as string}
          />
        </AvatarWrapper>
      </SetCard>
    </>
  );
};

export default Seting;
