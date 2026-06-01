import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input, Modal, message } from 'antd';
import { StarFilled, StarOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import SegmentTabs from '../components/SegmentTabs';
import UploadField from '../components/UploadField';
import EmptyState from '../components/EmptyState';
import { mobilePalette, CardSurface, PrimaryButton, GhostButton } from '../styles';
import { SORT_TYPE, TARGET_TYPE } from '../constants';
import { mobileApi, SipScore, SipScoreEntry } from '../api';

const Hero = styled.section`
  display: grid;
  grid-template-columns: 104px 1fr;
  gap: 14px;
  padding: 16px;
  background: ${mobilePalette.paper};
  border-bottom: 1px solid ${mobilePalette.line};
`;

const Cover = styled.div<{ src?: string }>`
  width: 104px;
  height: 104px;
  border-radius: 8px;
  background: ${(props) =>
    props.src
      ? `url(${props.src}) center/cover`
      : 'linear-gradient(135deg, #ffe8a8, #8bc6a4)'};
`;

const EntryCover = styled(Cover)`
  width: 72px;
  height: 72px;
`;

const Info = styled.div`
  h1 {
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 900;
  }
  p {
    margin: 0;
    color: ${mobilePalette.muted};
    line-height: 1.5;
  }
`;

const Collect = styled.button<{ active?: boolean }>`
  margin-top: 12px;
  height: 34px;
  padding: 0 12px;
  border-radius: 8px;
  background: ${(props) => (props.active ? '#fff5d7' : '#fff')};
  border: 1px solid ${(props) => (props.active ? '#ffd66e' : mobilePalette.line)};
  color: ${(props) => (props.active ? mobilePalette.orange : mobilePalette.ink)};
`;

const EntryList = styled.div`
  display: grid;
  gap: 10px;
  padding: 12px;
`;

const EntryCard = styled(CardSurface)`
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 12px;
  padding: 12px;
`;

const AddButton = styled.button`
  position: fixed;
  right: 18px;
  bottom: calc(18px + env(safe-area-inset-bottom));
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${mobilePalette.orange};
  color: #fff;
  font-size: 20px;
  box-shadow: 0 12px 28px rgba(255, 159, 26, 0.32);
`;

const FormGrid = styled.div`
  display: grid;
  gap: 12px;
`;

const scoreText = (score?: number) => ((score || 0) / 100).toFixed(1);

const SipScoreDetail: React.FC = () => {
  const { id } = useParams();
  const sipScoreId = Number(id);
  const nav = useNavigate();
  const [sipScore, setSipScore] = useState<SipScore | null>(null);
  const [entries, setEntries] = useState<SipScoreEntry[]>([]);
  const [sort, setSort] = useState<number>(SORT_TYPE.hottest);
  const [open, setOpen] = useState(false);
  const [entryName, setEntryName] = useState('');
  const [entryDesc, setEntryDesc] = useState('');
  const [entryCover, setEntryCover] = useState('');

  const load = async () => {
    const meta = await mobileApi.sipScore.get(sipScoreId);
    if (meta.code === 0) setSipScore(meta.data.sip_score || {});
    const list = await mobileApi.sipScore.entries(sipScoreId, {
      sort_type: sort,
      page_size: 50,
    });
    if (list.code === 0) setEntries(list.data.entries || []);
  };

  useEffect(() => {
    if (sipScoreId) load();
  }, [sipScoreId, sort]);

  const toggleCollect = async () => {
    if (!sipScore?.id) return;
    setSipScore({
      ...sipScore,
      is_collected: !sipScore.is_collected,
      collect_count: (sipScore.collect_count || 0) + (sipScore.is_collected ? -1 : 1),
    });
    await mobileApi.collection.toggle(sipScore.id, TARGET_TYPE.sipScore);
  };

  const submitEntry = async () => {
    if (!entryName.trim()) {
      message.warning('请填写评分对象名称');
      return;
    }
    const res = await mobileApi.sipScore.createEntries({
      sip_score_id: sipScoreId,
      entries: [{ name: entryName, description: entryDesc, cover_img: entryCover }],
    });
    if (res.code !== 0) {
      message.error(res.message);
      return;
    }
    setOpen(false);
    setEntryName('');
    setEntryDesc('');
    setEntryCover('');
    load();
  };

  if (!sipScore) {
    return (
      <MobileShell title="榜单详情" back tabs={false}>
        <EmptyState text="加载中..." />
      </MobileShell>
    );
  }

  return (
    <MobileShell title="榜单详情" back tabs={false}>
      <Hero>
        <Cover src={sipScore.cover_img} />
        <Info>
          <h1>{sipScore.name}</h1>
          <p>{sipScore.description}</p>
          <Collect active={sipScore.is_collected} onClick={toggleCollect}>
            {sipScore.is_collected ? <StarFilled /> : <StarOutlined />}{' '}
            {sipScore.collect_count || 0}
          </Collect>
        </Info>
      </Hero>
      <SegmentTabs
        value={sort}
        items={[
          { label: '热门', value: SORT_TYPE.hottest },
          { label: '最新', value: SORT_TYPE.newest },
          { label: '高分', value: SORT_TYPE.highest },
          { label: '低分', value: SORT_TYPE.lowest },
        ]}
        onChange={(value) => setSort(Number(value))}
      />
      {entries.length ? (
        <EntryList>
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              onClick={() => nav(`/sip-score/${sipScoreId}/entry/${entry.id}`)}
            >
              <EntryCover src={entry.cover_img} />
              <Info>
                <h1 style={{ fontSize: 16 }}>{entry.name}</h1>
                <p>{entry.description || '暂无简介'}</p>
                <p style={{ marginTop: 8 }}>
                  {scoreText(entry.score_avg)} 分 ·{' '}
                  {entry.participant_num || entry.participant_count || 0} 人评分
                </p>
              </Info>
            </EntryCard>
          ))}
        </EntryList>
      ) : (
        <EmptyState text="还没有评分对象" />
      )}
      <AddButton onClick={() => setOpen(true)}>
        <PlusOutlined />
      </AddButton>
      <Modal
        title="添加评分对象"
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <GhostButton key="cancel" onClick={() => setOpen(false)}>
            取消
          </GhostButton>,
          <PrimaryButton key="ok" onClick={submitEntry}>
            添加
          </PrimaryButton>,
        ]}
      >
        <FormGrid>
          <Input
            value={entryName}
            onChange={(event) => setEntryName(event.target.value)}
            placeholder="名称"
          />
          <Input.TextArea
            value={entryDesc}
            onChange={(event) => setEntryDesc(event.target.value)}
            placeholder="简介"
            rows={3}
          />
          <UploadField value={entryCover} onChange={setEntryCover} />
        </FormGrid>
      </Modal>
    </MobileShell>
  );
};

export default SipScoreDetail;
