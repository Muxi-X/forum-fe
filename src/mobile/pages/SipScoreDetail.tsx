import React, { useEffect, useMemo, useState } from 'react';
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
import StarRating from '../components/StarRating';
import {
  mobileMotion,
  mobilePalette,
  mobileRadius,
  CardSurface,
  PrimaryButton,
} from '../styles';
import { SORT_TYPE, TARGET_TYPE } from '../constants';
import { mobileApi, SipScore, SipScoreEntry } from '../api';
import DesignIcon from '../components/DesignIcon';
import { mastergoAssets } from '../assets/mastergo';
import {
  applyStoredSipScoreEntryPatches,
  emitSipScoreEntryPatch,
  emitSipScorePatch,
} from '../postEvents';

const Page = styled.div`
  min-height: 100%;
  background: ${mobilePalette.bg};
  padding-bottom: calc(94px + env(safe-area-inset-bottom));
`;

const Hero = styled.section`
  background: linear-gradient(180deg, #fffaf0 0%, #fff 100%);
  border-bottom: 1px solid rgba(255, 198, 65, 0.22);
`;

const CoverWrap = styled.div`
  position: relative;
  height: 206px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255, 198, 65, 0.28), rgba(254, 152, 0, 0.16));
`;

const CoverShade = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(26, 32, 44, 0.08) 0%,
    rgba(26, 32, 44, 0.28) 100%
  );
`;

const CoverText = styled.div`
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 22px;
  color: #fff;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.24);
  h1 {
    margin: 0 0 8px;
    font-size: 29px;
    font-weight: 850;
    line-height: 1.12;
    letter-spacing: 0;
  }
  p {
    margin: 0;
    font-size: 13px;
    opacity: 0.95;
  }
`;

const Info = styled.div`
  padding: 18px 20px 16px;
`;

const Description = styled.p`
  margin: 0;
  color: ${mobilePalette.inkSoft};
  font-size: 14px;
  line-height: 1.62;
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
`;

const StatPill = styled.span`
  height: 30px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0 11px;
  border-radius: ${mobileRadius.pill};
  background: rgba(255, 198, 65, 0.15);
  color: #9d6400;
  font-size: 12px;
  font-weight: 750;
`;

const Collect = styled.button<{ active?: boolean }>`
  height: 30px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0 11px;
  border-radius: ${mobileRadius.pill};
  background: ${(props) => (props.active ? '#fff3c7' : 'rgba(255,255,255,0.78)')};
  border: 1px solid ${(props) => (props.active ? '#ffd66e' : 'rgba(60,60,67,0.1)')};
  color: ${(props) => (props.active ? mobilePalette.orange : mobilePalette.inkSoft)};
  font-size: 12px;
  font-weight: 800;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
`;

const Tag = styled.span`
  max-width: 100%;
  height: 28px;
  display: inline-flex;
  align-items: center;
  border-radius: ${mobileRadius.pill};
  padding: 0 11px;
  background: #fff8df;
  color: #9d6400;
  font-size: 12px;
  font-weight: 800;
`;

const EntryList = styled.div`
  display: grid;
  gap: 12px;
  padding: 2px 16px 16px;
`;

const EntryCard = styled(CardSurface)`
  display: grid;
  grid-template-columns: 34px 68px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  padding: 14px;
  border: 0;
  border-radius: 24px;
  box-shadow: 0 13px 30px rgba(16, 24, 40, 0.06);
  transition: transform ${mobileMotion.fast}, box-shadow ${mobileMotion.fast};
  &:active {
    transform: scale(0.986);
    box-shadow: 0 7px 20px rgba(16, 24, 40, 0.055);
  }
`;

const Rank = styled.strong<{ $top?: boolean }>`
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: ${(props) => (props.$top ? '#fff3c7' : 'rgba(60,60,67,0.05)')};
  color: ${(props) => (props.$top ? mobilePalette.orange : mobilePalette.muted)};
  font-size: 17px;
  font-weight: 900;
`;

const EntryCover = styled.div`
  width: 68px;
  height: 68px;
  border-radius: 17px;
  overflow: hidden;
  box-shadow: 0 8px 18px rgba(16, 24, 40, 0.1);
`;

const EntryBody = styled.div`
  min-width: 0;
`;

const EntryHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

const EntryTitle = styled.h2`
  min-width: 0;
  margin: 1px 0 6px;
  color: ${mobilePalette.ink};
  font-size: 16px;
  font-weight: 850;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ScoreBlock = styled.div`
  flex: 0 0 auto;
  text-align: right;
  color: ${mobilePalette.orange};
  font-size: 21px;
  font-weight: 900;
  line-height: 1.05;
  span {
    display: block;
    color: ${mobilePalette.muted};
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
  }
`;

const EntryMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  color: ${mobilePalette.muted};
  font-size: 12px;
`;

const EntryDesc = styled.p`
  margin: 7px 0 0;
  color: ${mobilePalette.muted};
  font-size: 13px;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RateButton = styled.button`
  height: 28px;
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0 10px;
  border-radius: ${mobileRadius.pill};
  background: rgba(255, 198, 65, 0.16);
  color: #a15a00;
  font-size: 12px;
  font-weight: 850;
`;

const AddButton = styled.button`
  position: fixed;
  left: 50%;
  bottom: calc(24px + env(safe-area-inset-bottom));
  z-index: 52;
  transform: translateX(-50%);
  width: min(192px, calc(100% - 64px));
  height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: ${mobileRadius.pill};
  background: linear-gradient(135deg, #ffc641, #fe9800);
  color: #fff;
  font-size: 15px;
  font-weight: 850;
  box-shadow: 0 16px 34px rgba(255, 159, 26, 0.3);
  transition: transform ${mobileMotion.fast}, box-shadow ${mobileMotion.fast};
  &:active {
    transform: translateX(-50%) scale(0.97);
    box-shadow: 0 10px 24px rgba(255, 159, 26, 0.25);
  }
  img {
    width: 14px;
    height: 14px;
    filter: brightness(0) invert(1);
  }
`;

const FormGrid = styled.div`
  display: grid;
  gap: 12px;
  .ant-input,
  .ant-input-affix-wrapper {
    border-radius: ${mobileRadius.lg};
    border-color: rgba(60, 60, 67, 0.12);
    box-shadow: 0 8px 20px rgba(16, 24, 40, 0.045);
  }
`;

const SheetSubmit = styled(PrimaryButton)`
  width: 100%;
`;

const getParticipants = (entry: SipScoreEntry) => Number(entry.participant_num || 0);

const scoreText = (entry: SipScoreEntry) => {
  if (!getParticipants(entry)) return '';
  return ((Number(entry.score_avg) || 0) / 100).toFixed(1);
};

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [meta, list] = await Promise.all([
        mobileApi.sipScore.get(sipScoreId),
        mobileApi.sipScore.entries(sipScoreId, {
          sort_type: sort,
          page_size: 50,
        }),
      ]);
      if (meta.code === 0) {
        setSipScore(meta.data.sip_score || {});
      } else {
        setError(meta.message || '榜单加载失败');
      }
      if (list.code === 0) {
        setEntries(applyStoredSipScoreEntryPatches(sipScoreId, list.data.entries || []));
      } else if (!error) {
        setError(list.message || '榜单对象加载失败');
      }
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
    const previous = sipScore;
    const nextCollected = !sipScore.is_collected;
    setSipScore({
      ...sipScore,
      is_collected: nextCollected,
      collect_count: Math.max(
        0,
        (sipScore.collect_count || 0) + (nextCollected ? 1 : -1),
      ),
    });
    try {
      const res = await mobileApi.collection.toggle(sipScore.id, TARGET_TYPE.sipScore);
      if (res.code !== 0) {
        setSipScore(previous);
        message.error(res.message || '收藏失败');
      } else {
        emitSipScorePatch({
          id: sipScore.id,
          is_collected: nextCollected,
          removed_from_collection: !nextCollected,
          collect_count: Math.max(
            0,
            (previous.collect_count || 0) + (nextCollected ? 1 : -1),
          ),
        });
      }
    } catch (err) {
      setSipScore(previous);
      message.error(err instanceof Error ? err.message : '收藏失败');
    }
  };

  const submitEntry = async () => {
    if (!entryName.trim()) {
      message.warning('请填写评分对象名称');
      return;
    }
    setSubmitting(true);
    try {
      const res = await mobileApi.sipScore.createEntries({
        sip_score_id: sipScoreId,
        entries: [
          {
            name: entryName.trim(),
            description: entryDesc.trim(),
            cover_img: entryCover,
          },
        ],
      });
      if (res.code !== 0) {
        message.error(res.message || '添加失败');
        return;
      }
      const createdId = Number(res.data.entry_ids?.[0] || 0);
      const createdEntry: SipScoreEntry = {
        id: createdId || undefined,
        sip_score_id: sipScoreId,
        name: entryName.trim(),
        description: entryDesc.trim(),
        cover_img: entryCover,
        participant_num: 0,
        score_avg: 0,
      };
      if (createdId) {
        emitSipScoreEntryPatch({
          sipScoreId,
          entryId: createdId,
          entry: createdEntry,
          created: true,
        });
        emitSipScorePatch({
          id: sipScoreId,
          entry_count: (sipScore?.entry_count || entries.length || 0) + 1,
        });
      }
      message.success('已添加评分对象');
      setOpen(false);
      setEntryName('');
      setEntryDesc('');
      setEntryCover('');
      setEntries((current) => (createdId ? [createdEntry, ...current] : current));
      load();
    } finally {
      setSubmitting(false);
    }
  };

  const sortItems = useMemo(
    () => [
      { label: '热门', value: SORT_TYPE.hottest },
      { label: '最新', value: SORT_TYPE.newest },
      { label: '高分', value: SORT_TYPE.highest },
      { label: '低分', value: SORT_TYPE.lowest },
    ],
    [],
  );

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
      <Page>
        <Hero>
          <CoverWrap>
            <MobileImage src={sipScore.cover_img} fallbackText="茶评" radius={0} />
            <CoverShade />
            <CoverText>
              <h1>{sipScore.name || '未命名榜单'}</h1>
              <p>由 {sipScore.creator?.name || '茶友'} 创建</p>
            </CoverText>
          </CoverWrap>
          <Info>
            <Description>
              {sipScore.description || '这个榜单还没有简介，先看看大家怎么评分。'}
            </Description>
            <Stats>
              <StatPill>{sipScore.entry_count || entries.length || 0} 个对象</StatPill>
              <StatPill>{sipScore.participant_count || 0} 人参与</StatPill>
              <Collect active={sipScore.is_collected} onClick={toggleCollect}>
                <DesignIcon
                  name="bookmark"
                  size={14}
                  color={
                    sipScore.is_collected ? mobilePalette.orange : mobilePalette.muted
                  }
                />
                {sipScore.is_collected ? '已收藏' : '收藏'}
                {sipScore.collect_count ? ` ${sipScore.collect_count}` : ''}
              </Collect>
            </Stats>
            {Array.isArray(sipScore.tags) && sipScore.tags.length ? (
              <TagRow>
                {sipScore.tags.map((tag) => (
                  <Tag key={tag}>#{tag.replace(/^#/, '')}</Tag>
                ))}
              </TagRow>
            ) : null}
          </Info>
        </Hero>
        <SegmentTabs
          value={sort}
          items={sortItems}
          onChange={(value) => setSort(Number(value))}
        />
        {entries.length ? (
          <EntryList>
            {entries.map((entry, index) => {
              const score = scoreText(entry);
              const participants = getParticipants(entry);
              return (
                <EntryCard
                  key={entry.id}
                  onClick={() => nav(`/sip-score/${sipScoreId}/entry/${entry.id}`)}
                >
                  <Rank $top={index < 3}>{index + 1}</Rank>
                  <EntryCover>
                    <MobileImage src={entry.cover_img} fallbackText="项目" radius={17} />
                  </EntryCover>
                  <EntryBody>
                    <EntryHead>
                      <div>
                        <EntryTitle>{entry.name || '未命名项目'}</EntryTitle>
                        <EntryMeta>
                          <StarRating
                            value={score ? Math.round(Number(score)) : 0}
                            size={13}
                            readonly
                          />
                          <span>{score ? `${score} 分` : '暂无评分'}</span>
                          <span>·</span>
                          <span>{participants} 人参与</span>
                        </EntryMeta>
                      </div>
                      <ScoreBlock>
                        {score || '--'}
                        <span>{participants ? '综合分' : '待评分'}</span>
                      </ScoreBlock>
                    </EntryHead>
                    <EntryDesc>{entry.description || '暂无简介'}</EntryDesc>
                    <RateButton
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        nav(`/sip-score/${sipScoreId}/entry/${entry.id}`, {
                          state: { openRating: true },
                        });
                      }}
                    >
                      打分
                      <DesignIcon name="chevronRight" size={13} color="#a15a00" />
                    </RateButton>
                  </EntryBody>
                </EntryCard>
              );
            })}
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
      </Page>
      <MobileBottomSheet open={open} title="添加评分对象" onClose={() => setOpen(false)}>
        <FormGrid>
          <Input
            value={entryName}
            maxLength={40}
            onChange={(event) => setEntryName(event.target.value)}
            placeholder="项目名称，例如：东区一楼奶茶"
          />
          <Input.TextArea
            value={entryDesc}
            maxLength={240}
            onChange={(event) => setEntryDesc(event.target.value)}
            placeholder="简单写一下它是什么，或者为什么值得评分"
            rows={4}
          />
          <UploadField value={entryCover} onChange={setEntryCover} label="上传封面" />
          <SheetSubmit type="button" disabled={submitting} onClick={submitEntry}>
            {submitting ? '添加中...' : '添加'}
          </SheetSubmit>
        </FormGrid>
      </MobileBottomSheet>
    </MobileShell>
  );
};

export default SipScoreDetail;
