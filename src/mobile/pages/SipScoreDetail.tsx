import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import SegmentTabs from '../components/SegmentTabs';
import UploadField from '../components/UploadField';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import MobileBottomSheet from '../components/MobileBottomSheet';
import MobileImage from '../components/MobileImage';
import {
  mobilePalette,
  mobileRadius,
  CardSurface,
  PrimaryButton,
  GhostButton,
} from '../styles';
import { SORT_TYPE, TARGET_TYPE } from '../constants';
import { mobileApi, SipScore, SipScoreEntry } from '../api';
import DesignIcon from '../components/DesignIcon';
import { mastergoAssets } from '../assets/mastergo';

const Hero = styled.section`
  position: relative;
  min-height: 340px;
  padding: 0;
  background: linear-gradient(180deg, #fffaf0 0%, #fff 100%);
  border-bottom: 1px solid ${mobilePalette.lineSoft};
`;

const CoverWrap = styled.div`
  position: relative;
  width: 100%;
  height: 206px;
  overflow: hidden;
  background: linear-gradient(120deg, #d4d4d4 0%, #777 100%);
`;

const CoverImg = styled.div`
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0.78;
`;

const CoverTitle = styled.div`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 24px;
  color: #fff;
  h1 {
    margin: 0 0 10px;
    font-size: 28px;
    line-height: 1.1;
    font-weight: 800;
  }
  span {
    font-size: 13px;
    opacity: 0.95;
  }
`;

const Cover = styled.div`
  width: 100%;
  height: 206px;
  border-radius: 0;
  overflow: hidden;
`;

const EntryCover = styled(Cover)`
  width: 64px;
  height: 64px;
  border-radius: ${mobileRadius.lg};
`;

const Info = styled.div`
  padding: 18px 20px 0;
  h1 {
    margin: 0 0 8px;
    font-size: 24px;
    font-weight: 700;
  }
  p {
    margin: 0;
    color: ${mobilePalette.muted};
    line-height: 1.5;
  }
`;

const Collect = styled.button<{ active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 14px;
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: ${(props) => (props.active ? '#fff5d7' : '#fff')};
  border: 1px solid ${(props) => (props.active ? '#ffd66e' : mobilePalette.line)};
  color: ${(props) => (props.active ? mobilePalette.orange : mobilePalette.ink)};
`;

const EntryList = styled.div`
  display: grid;
  gap: 12px;
  padding: 4px 16px 94px;
`;

const EntryCard = styled(CardSurface)`
  display: grid;
  grid-template-columns: 30px 64px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  padding: 14px;
  border: 0;
  border-radius: 22px;
  box-shadow: 0 10px 28px rgba(16, 24, 40, 0.06);
`;

const RankNumber = styled.strong`
  color: #7f838a;
  font-size: 20px;
  text-align: center;
`;

const AddButton = styled.button`
  position: fixed;
  left: 50%;
  bottom: calc(24px + env(safe-area-inset-bottom));
  transform: translateX(-50%);
  width: 138px;
  height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: 999px;
  background: linear-gradient(135deg, #ffc641, #fe9800);
  color: #fff;
  font-size: 14px;
  box-shadow: 0 12px 28px rgba(255, 159, 26, 0.32);
  img {
    width: 14px;
    height: 14px;
    filter: brightness(0) invert(1);
  }
`;

const FormGrid = styled.div`
  display: grid;
  gap: 12px;
  .actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const meta = await mobileApi.sipScore.get(sipScoreId);
      if (meta.code === 0) setSipScore(meta.data.sip_score || {});
      else setError(meta.message || '榜单加载失败');
      const list = await mobileApi.sipScore.entries(sipScoreId, {
        sort_type: sort,
        page_size: 50,
      });
      if (list.code === 0) setEntries(list.data.entries || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '榜单加载失败');
    } finally {
      setLoading(false);
    }
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

  if (loading && !sipScore) {
    return (
      <MobileShell title="榜单详情" back tabs={false}>
        <LoadingState text="正在打开榜单..." />
      </MobileShell>
    );
  }

  if (error && !sipScore) {
    return (
      <MobileShell title="榜单详情" back tabs={false}>
        <ErrorState text={error} onRetry={load} />
      </MobileShell>
    );
  }

  if (!sipScore) return null;

  return (
    <MobileShell title="榜单详情" back tabs={false}>
      <Hero>
        <CoverWrap>
          <CoverImg>
            <MobileImage src={sipScore.cover_img} fallbackText="茶评" radius={0} />
          </CoverImg>
          <CoverTitle>
            <h1>{sipScore.name}</h1>
            <span>由 {sipScore.creator?.name || '茶友'} 创建</span>
          </CoverTitle>
        </CoverWrap>
        <Info>
          <p>{sipScore.description}</p>
          <Collect active={sipScore.is_collected} onClick={toggleCollect}>
            <DesignIcon
              name="bookmark"
              size={15}
              color={sipScore.is_collected ? mobilePalette.orange : mobilePalette.muted}
            />
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
          {entries.map((entry, index) => (
            <EntryCard
              key={entry.id}
              onClick={() => nav(`/sip-score/${sipScoreId}/entry/${entry.id}`)}
            >
              <RankNumber>{index + 1}</RankNumber>
              <EntryCover>
                <MobileImage src={entry.cover_img} fallbackText="项目" radius={0} />
              </EntryCover>
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
        <EmptyState
          title="还没有评分对象"
          text="添加第一个项目，大家就能开始评分了。"
          actionText="添加新项目"
          onAction={() => setOpen(true)}
        />
      )}
      <AddButton onClick={() => setOpen(true)}>
        <img src={mastergoAssets.icons.addSmall} alt="" />
        添加新项目
      </AddButton>
      <MobileBottomSheet open={open} title="添加评分对象" onClose={() => setOpen(false)}>
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
          <div className="actions">
            <GhostButton type="button" onClick={() => setOpen(false)}>
              取消
            </GhostButton>
            <PrimaryButton type="button" onClick={submitEntry}>
              添加
            </PrimaryButton>
          </div>
        </FormGrid>
      </MobileBottomSheet>
    </MobileShell>
  );
};

export default SipScoreDetail;
