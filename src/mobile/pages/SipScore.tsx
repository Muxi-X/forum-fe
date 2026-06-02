import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import MobileShell from '../components/MobileShell';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import MobileImage from '../components/MobileImage';
import PullToRefresh from '../components/PullToRefresh';
import { mobileMotion, mobilePalette, mobileRadius, CardSurface } from '../styles';
import { SORT_TYPE } from '../constants';
import { mobileApi, SipScoreWithEntries } from '../api';
import DesignIcon from '../components/DesignIcon';
import { mastergoAssets } from '../assets/mastergo';

const PREVIEW_ENTRY_LIMIT = 2;

const Header = styled.section`
  padding: calc(22px + env(safe-area-inset-top)) 20px 16px;
  background: linear-gradient(180deg, #fffaf0 0%, #f8f9fc 100%);
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
  h1 {
    margin: 0;
    color: ${mobilePalette.ink};
    font-size: 30px;
    font-weight: 800;
    line-height: 1.12;
  }
`;

const SearchStack = styled.div`
  display: grid;
  gap: 12px;
`;

const SortRow = styled.div`
  display: inline-flex;
  width: max-content;
  max-width: 100%;
  gap: 4px;
  padding: 4px;
  border: 1px solid rgba(60, 60, 67, 0.08);
  border-radius: ${mobileRadius.pill};
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.05);
`;

const SortButton = styled.button<{ active: boolean }>`
  min-width: 58px;
  height: 32px;
  padding: 0 14px;
  border-radius: ${mobileRadius.pill};
  background: ${(props) => (props.active ? '#fff' : 'transparent')};
  color: ${(props) => (props.active ? mobilePalette.orange : mobilePalette.muted)};
  font-weight: ${(props) => (props.active ? 700 : 500)};
  box-shadow: ${(props) =>
    props.active ? '0 6px 16px rgba(254, 152, 0, 0.14)' : 'none'};
  transition: background ${mobileMotion.fast}, color ${mobileMotion.fast},
    box-shadow ${mobileMotion.fast}, transform ${mobileMotion.fast};
  &:active {
    transform: scale(0.96);
  }
`;

const List = styled.div`
  display: grid;
  gap: 14px;
  padding: 14px 16px 30px;
  background: ${mobilePalette.bg};
`;

const Card = styled(CardSurface)`
  display: block;
  padding: 18px;
  border: 0;
  border-radius: 24px;
  box-shadow: 0 16px 36px rgba(16, 24, 40, 0.08);
  overflow: hidden;
  transition: transform ${mobileMotion.fast}, box-shadow ${mobileMotion.fast};
  &:active {
    transform: scale(0.985);
    box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
  }
`;

const Cover = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 18px rgba(16, 24, 40, 0.12);
`;

const Info = styled.div`
  min-width: 0;
  h2 {
    margin: 0 0 6px;
    font-size: 16px;
    line-height: 1.28;
    font-weight: 700;
    color: ${mobilePalette.ink};
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  p {
    margin: 0;
    color: ${mobilePalette.muted};
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const Stats = styled.div`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
  color: ${mobilePalette.muted};
  font-size: 12px;
`;

const EntryPreview = styled.div`
  color: ${mobilePalette.muted};
  font-size: 13px;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ScoreDot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: ${mobilePalette.inkSoft};
  font-weight: 600;
`;

const DividerDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(127, 131, 138, 0.58);
`;

const CreateButton = styled.button`
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 0 14px;
  background: linear-gradient(135deg, #ffc641, #fe9800);
  color: #fffdf8;
  font-weight: 700;
  box-shadow: 0 10px 22px rgba(254, 152, 0, 0.22);
  transition: transform ${mobileMotion.fast}, box-shadow ${mobileMotion.fast};
  &:active {
    transform: scale(0.96);
    box-shadow: 0 6px 16px rgba(254, 152, 0, 0.18);
  }
  img {
    width: 14px;
    height: 14px;
    filter: brightness(0) invert(1);
  }
`;

const RankingTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin: 0 0 12px;
`;

const TitleText = styled.div`
  min-width: 0;
  h2 {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    margin: 0;
    color: ${mobilePalette.ink};
    font-size: 20px;
    font-weight: 800;
    line-height: 1.25;
    span {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    img {
      width: 11px;
      height: 11px;
      flex: 0 0 auto;
    }
  }
  p {
    margin: 5px 0 0;
    color: ${mobilePalette.muted};
    font-size: 12px;
    line-height: 1.35;
  }
`;

const MoreLink = styled.span`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 28px;
  margin-top: -2px;
  padding-left: 8px;
  color: ${mobilePalette.muted};
  font-size: 12px;
  font-weight: 500;
`;

const Entries = styled.div`
  display: grid;
  gap: 14px;
`;

const EmptyPreview = styled.div`
  display: grid;
  gap: 6px;
  padding: 18px;
  border-radius: 18px;
  background: rgba(255, 248, 225, 0.64);
  color: ${mobilePalette.muted};
  h3 {
    margin: 0;
    color: ${mobilePalette.ink};
    font-size: 16px;
    font-weight: 700;
  }
  p {
    margin: 0;
    line-height: 1.5;
  }
`;

const EntryRow = styled.div`
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  min-width: 0;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 14px;
  color: ${mobilePalette.orange};
  font-size: 13px;
  font-weight: 700;
`;

const getEntryCount = (item: SipScoreWithEntries) => {
  const sip = (item.sip_score || {}) as Record<string, any>;
  return (
    Number(sip.entry_count || 0) ||
    Number(sip.entries_count || 0) ||
    Number((item.entries || []).length)
  );
};

const getCollectCount = (item: SipScoreWithEntries) => {
  const sip = (item.sip_score || {}) as Record<string, any>;
  return Number(sip.collect_count || sip.collection_count || sip.collections_count || 0);
};

const getParticipantCount = (entry: Record<string, any>) =>
  Number(entry.participant_num || entry.participant_count || 0);

const getScoreText = (entry: Record<string, any>) => {
  const participants = getParticipantCount(entry);
  if (!participants) return '暂无评分';
  return ((Number(entry.score_avg) || 0) / 100).toFixed(1);
};

type SipScoreCacheState = {
  items: SipScoreWithEntries[];
  sort: number;
  keyword: string;
  loaded: boolean;
};

const sipScoreCache: SipScoreCacheState = {
  items: [],
  sort: SORT_TYPE.newest,
  keyword: '',
  loaded: false,
};

const SipScore: React.FC = () => {
  const nav = useNavigate();
  const [items, setItems] = useState<SipScoreWithEntries[]>(sipScoreCache.items);
  const [sort, setSort] = useState<number>(sipScoreCache.sort);
  const [keyword, setKeyword] = useState(sipScoreCache.keyword);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(sipScoreCache.loaded);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = keyword
        ? await mobileApi.sipScore.search({ keyword, page_size: 20 })
        : await mobileApi.sipScore.list({ sort_type: sort, page_size: 20 });
      if (res.code !== 0) {
        setError(res.message || '榜单加载失败');
        message.error(res.message || '榜单加载失败');
        return;
      }
      const nextItems = res.data.sip_scores || [];
      setItems(nextItems);
      sipScoreCache.items = nextItems;
      sipScoreCache.sort = sort;
      sipScoreCache.keyword = keyword;
      sipScoreCache.loaded = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '榜单加载失败');
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  };

  useEffect(() => {
    if (
      sipScoreCache.loaded &&
      sipScoreCache.sort === sort &&
      sipScoreCache.keyword === keyword
    ) {
      setItems(sipScoreCache.items);
      setLoaded(true);
      setLoading(false);
      return;
    }
    load();
  }, [sort, keyword]);

  return (
    <MobileShell title="茶评" showTopBar={false}>
      <PullToRefresh disabled={loading} onRefresh={load}>
        <Header>
          <HeaderTop>
            <h1>茶评</h1>
            <CreateButton type="button" onClick={() => nav('/sip-score/new')}>
              <img src={mastergoAssets.icons.addSmall} alt="" />
              建榜
            </CreateButton>
          </HeaderTop>
          <SearchStack>
            <SearchBar
              defaultValue={keyword}
              placeholder="搜索榜单"
              onSearch={setKeyword}
            />
            <SortRow aria-label="榜单排序">
              {[
                { label: '最新', value: SORT_TYPE.newest },
                { label: '热门', value: SORT_TYPE.hottest },
              ].map((item) => (
                <SortButton
                  key={item.value}
                  type="button"
                  active={sort === item.value}
                  aria-pressed={sort === item.value}
                  onClick={() => setSort(item.value)}
                >
                  {item.label}
                </SortButton>
              ))}
            </SortRow>
          </SearchStack>
        </Header>
        {items.length ? (
          <List>
            {items.map((item) => {
              const sip = item.sip_score || {};
              const entries = (item.entries || []).slice(0, PREVIEW_ENTRY_LIMIT);
              const entryCount = getEntryCount(item);
              const collectCount = getCollectCount(item);
              return (
                <Card key={sip.id} onClick={() => sip.id && nav(`/sip-score/${sip.id}`)}>
                  <RankingTitle>
                    <TitleText>
                      <h2>
                        <span>{sip.name || '未命名榜单'}</span>
                        <img src={mastergoAssets.icons.collectionSmallSquare} alt="" />
                      </h2>
                      <p>
                        {entryCount ? `${entryCount} 个对象` : '等待评分对象'}
                        {collectCount ? ` · ${collectCount} 人收藏` : ''}
                      </p>
                    </TitleText>
                    <MoreLink>
                      详情
                      <DesignIcon name="chevronRight" size={15} />
                    </MoreLink>
                  </RankingTitle>
                  {entries.length ? (
                    <Entries>
                      {entries.map((entry) => (
                        <EntryRow key={entry.id || entry.name}>
                          <Cover>
                            <MobileImage
                              src={entry.cover_img || sip.cover_img}
                              fallbackText="茶评"
                              radius={14}
                            />
                          </Cover>
                          <Info>
                            <h2>{entry.name || '未命名项目'}</h2>
                            <Stats>
                              <ScoreDot>
                                <DesignIcon name="star" size={13} color="#ffb300" />
                                {getScoreText(entry)}
                              </ScoreDot>
                              <DividerDot />
                              <span>{getParticipantCount(entry)} 人参与</span>
                            </Stats>
                            <EntryPreview>
                              {entry.description || sip.description || '暂无简介'}
                            </EntryPreview>
                          </Info>
                        </EntryRow>
                      ))}
                    </Entries>
                  ) : (
                    <EmptyPreview>
                      <h3>还没有评分对象</h3>
                      <p>{sip.description || '进入榜单添加第一个对象。'}</p>
                    </EmptyPreview>
                  )}
                  {entryCount > entries.length ? (
                    <CardFooter>查看全部 {entryCount} 个对象</CardFooter>
                  ) : null}
                </Card>
              );
            })}
          </List>
        ) : error ? (
          <ErrorState text={error} onRetry={load} />
        ) : loading || !loaded ? (
          <LoadingState text="正在读取茶评榜..." />
        ) : (
          <EmptyState
            title={keyword ? '没有找到相关榜单' : '还没有榜单'}
            text={keyword ? '换个关键词看看。' : '创建一个榜单，让大家一起评分。'}
            actionText="创建榜单"
            onAction={() => nav('/sip-score/new')}
          />
        )}
      </PullToRefresh>
    </MobileShell>
  );
};

export default SipScore;
