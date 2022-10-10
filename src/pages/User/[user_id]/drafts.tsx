import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { List, Divider, Card, Popover, Modal } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Drafts, { Draft } from 'utils/db_drafts';

const Wrapper = styled(Card)`
  .ant-divider-inner-text {
    color: rgb(255 208 4);
  }

  h3 {
    cursor: pointer;
    :hover {
      color: rgb(255 208 4);
    }
  }
  .ant-list-item {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Time = styled.div`
  user-select: none;
`;

const Info = styled.div`
  display: flex;
  color: #909090;
  align-items: center;
`;

const ActionWrapper = styled.span`
  cursor: pointer;
  font-size: 1.8rem;
  margin-left: 2rem;
  font-weight: bold;
`;

const Action = styled.div`
  user-select: none;
  color: #909090;
  font-size: 0.8rem;
  padding: 0 1rem;
  cursor: pointer;
  :hover {
    color: rgb(255 208 4);
  }
`;

const Title = styled.h3``;

const DraftsBox: React.FC = () => {
  const { user_id } = useParams();
  const [drafts, setDrafts] = useState<Draft[]>();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopversOpen, setIsPopversOpen] = useState<boolean[]>(
    Array(drafts?.length).fill(false),
  );
  const [selectedId, setSelectedId] = useState('');

  const nav = useNavigate();

  const handleOk = () => {
    setIsModalOpen(false);
    Drafts.deleteDraft(selectedId);
    setDrafts(drafts?.filter((draft) => draft.id !== selectedId));
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    Drafts.getDraftsList(+(user_id as string)).then((res) => {
      setDrafts(res);
      setLoading(false);
    });
  }, []);

  const handleEditor = (id: string) => {
    nav(`/editor/${id}`);
  };

  const handleDelete = (index: number, id: string) => {
    setIsModalOpen(true);
    setSelectedId(id);
    let newArray = [...isPopversOpen];
    newArray[index] = false;
    setIsPopversOpen(newArray);
  };

  return (
    <Wrapper>
      <Divider orientation="left">草稿箱（{drafts?.length}）</Divider>
      <List
        dataSource={drafts}
        renderItem={(item, i) => (
          <List.Item>
            <Title
              onClick={() => {
                handleEditor(item.id);
              }}
            >
              {item.title ? item.title : '无标题'}
            </Title>
            <Info>
              <Time>{item.time}</Time>
              <Popover
                open={isPopversOpen[i]}
                placement="right"
                content={
                  <>
                    <Action
                      onClick={() => {
                        handleEditor(item.id);
                      }}
                    >
                      编辑
                    </Action>
                    <Action
                      onClick={() => {
                        handleDelete(i, item.id);
                      }}
                    >
                      删除
                    </Action>
                  </>
                }
                trigger="click"
                onOpenChange={(newOpen: boolean) => {
                  let newArray = [...isPopversOpen];
                  newArray[i] = newOpen;
                  setIsPopversOpen(newArray);
                }}
              >
                <ActionWrapper
                  onClick={() => {
                    let newArray = [...isPopversOpen];
                    newArray[i] = true;
                    setIsPopversOpen(newArray);
                  }}
                >
                  <EllipsisOutlined />
                </ActionWrapper>
              </Popover>
            </Info>
          </List.Item>
        )}
      />
      <Modal
        centered
        title="删除草稿"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <p>删除后不可恢复，确认删除此草稿吗</p>
      </Modal>
    </Wrapper>
  );
};

export default DraftsBox;
