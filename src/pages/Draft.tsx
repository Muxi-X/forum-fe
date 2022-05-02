import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { getDraftsList, Draft } from 'db/db';
import { w } from 'styles/global';

interface ItemProps {
  title: string;
  content: string;
  onClick: () => void;
}

const Item = styled.li`
  margin: 0.5em;
  border-bottom: 0.5px solid #ebeaea;
  padding-bottom: 0.5em;
  min-height: 8vh;
  :hover {
    background-color: #f8f8f8;
    cursor: pointer;
  }
`;
const ItemWrapper = styled.ul`
  padding: 1em;
  list-style: none;
  min-height: 90vh;
  ${w}
`;

const DraftItem: React.FC<ItemProps> = ({ onClick, title, content }) => {
  return (
    <Item onClick={onClick}>
      <h5>{title}</h5>
      <div> {content} </div>
    </Item>
  );
};

const Drafts: React.FC = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const nav = useNavigate();

  const handleToDraft = (draftId: string) => {
    nav(`/editor/drafts/${draftId}`);
  };

  useEffect(() => {
    getDraftsList().then((res) => setDrafts(res));
  }, []);
  return (
    <>
      草稿页面
      <ItemWrapper>
        {drafts.map((draft) => (
          <DraftItem
            onClick={() => handleToDraft(draft.id)}
            key={draft.id}
            title={draft.title}
            content={draft.content}
          />
        ))}
      </ItemWrapper>
    </>
  );
};

export default Drafts;
