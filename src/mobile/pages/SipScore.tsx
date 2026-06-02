import React, { useEffect, useMemo, useState } from 'react';
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
import BackToTopButton from '../components/BackToTopButton';
import { mobileMotion, mobilePalette, mobileRadius, CardSurface } from '../styles';
import { SORT_TYPE } from '../constants';
import { mobileApi, SipScoreEntry, SipScoreWithEntries } from '../api';
import DesignIcon from '../components/DesignIcon';
import { mastergoAssets } from '../assets/mastergo';
import {
  applySipScorePatch,
  applyStoredSipScoreEntryPatches,
  applyStoredSipScorePatches,
  getSipScoreRevision,
  MOBILE_SIP_SCORE_CREATED_EVENT,
  MOBILE_SIP_SCORE_ENTRY_EVENT,
  MOBILE_SIP_SCORE_EVENT,
  SipScoreEntryPatch,
  SipScorePatch,
} from '../postEvents';

const PREVIEW_ENTRY_LIMIT = 3;
const BRAND_LOGO = 'https://ossforum.muxixyz.com/logo1.png';

const Root = styled.div`
  min-height: 100dvh;
  background: ${mobilePalette.bg};
`;

const Header = styled.section`
  padding: calc(24px + env(safe-area-inset-top)) 20px 14px;
  background: linear-gradient(180deg, #fffaf0 0%, #f8f9fc 100%);
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
  h1 {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    margin: 0;
    color: ${mobilePalette.ink};
    font-size: 32px;
    font-weight: 800;
    letter-spacing: 0;
    line-height: 1.1;
    img {
      width: 32px;
      height: 32px;
      flex: 0 0 32px;
      object-fit: contain;
    }
  }
`;

const CreateButton = styled.button`
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  flex: 0 0 auto;
  border-radius: ${mobileRadius.pill};
  padding: 0 17px;
  background: linear-gradient(135deg, #ffc641, #fe9800);
  color: #fffdf8;
  font-weight: 800;
  box-shadow: 0 12px 24px rgba(254, 152, 0, 0.24);
  transition: transform ${mobileMotion.fast}, box-shadow ${mobileMotion.fast};
  &:active {
    transform: scale(0.96);
    box-shadow: 0 7px 18px rgba(254, 152, 0, 0.2);
  }
  img {
    width: 13px;
    height: 13px;
    filter: brightness(0) invert(1);
  }
`;

const HeaderControls = styled.div`
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
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 10px 24px rgba(16, 24, 40, 0.05);
`;

const SortButton = styled.button<{ active: boolean }>`
  min-width: 60px;
  height: 34px;
  padding: 0 16px;
  border-radius: ${mobileRadius.pill};
  background: ${(props) => (props.active ? '#fff' : 'transparent')};
  color: ${(props) => (props.active ? mobilePalette.orange : mobilePalette.muted)};
  font-weight: ${(props) => (props.active ? 800 : 600)};
  box-shadow: ${(props) =>
    props.active ? '0 8px 18px rgba(254, 152, 0, 0.14)' : 'none'};
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
`;

const Card = styled(CardSurface)<{ $pressed?: boolean }>`
  padding: 18px 18px 16px;
  border: 0;
  border-radius: 26px;
  box-shadow: ${(props) =>
    props.$pressed
      ? '0 8px 22px rgba(16, 24, 40, 0.06)'
      : '0 18px 38px rgba(16, 24, 40, 0.075)'};
  overflow: hidden;
  transform: ${(props) => (props.$pressed ? 'scale(0.986)' : 'none')};
  transition: transform ${mobileMotion.fast}, box-shadow ${mobileMotion.fast};
`;

const CardHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 13px;
`;

const TitleGroup = styled.div`
  min-width: 0;
  h2 {
    display: flex;
    align-items: center;
    gap: 7px;
    margin: 0;
    color: ${mobilePalette.ink};
    font-size: 20px;
    font-weight: 800;
    line-height: 1.22;
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
`;

const Dot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(127, 131, 138, 0.62);
`;

const DetailLink = styled.button`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 30px;
  padding: 0 0 0 8px;
  color: ${mobilePalette.muted};
  background: transparent;
  font-size: 12px;
  font-weight: 700;
`;

const EntryList = styled.div`
  display: grid;
  gap: 13px;
  margin-top: 12px;
`;

const EntryRow = styled.button`
  display: grid;
  grid-template-columns: 62px minmax(0, 1fr);
  gap: 12px;
  width: 100%;
  padding: 8px;
  border: 0;
  border-radius: 20px;
  text-align: left;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: background ${mobileMotion.fast}, transform ${mobileMotion.fast};
  &:active {
    background: rgba(255, 198, 65, 0.1);
    transform: translateY(1px);
  }
`;

const EntryCover = styled.div`
  width: 62px;
  height: 62px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 18px rgba(16, 24, 40, 0.1);
`;

const EntryMain = styled.div`
  min-width: 0;
`;

const EntryTop = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 10px;
`;

const EntryName = styled.h3`
  margin: 1px 0 5px;
  color: ${mobilePalette.ink};
  font-size: 16px;
  font-weight: 800;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ScoreBadge = styled.div`
  min-width: 52px;
  text-align: right;
  color: ${mobilePalette.orange};
  font-size: 25px;
  font-weight: 900;
  line-height: 1;
  .empty {
    color: ${mobilePalette.muted};
    font-size: 12px;
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
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(255, 198, 65, 0.16);
  color: #7f6c4e;
  font-size: 12px;
  line-height: 1.3;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const EmptyPreview = styled.div`
  display: grid;
  gap: 6px;
  margin-top: 12px;
  padding: 18px;
  border-radius: 18px;
  background: rgba(255, 248, 225, 0.64);
  color: ${mobilePalette.muted};
  h3 {
    margin: 0;
    color: ${mobilePalette.ink};
    font-size: 16px;
    font-weight: 800;
  }
  p {
    margin: 0;
    line-height: 1.5;
  }
`;

const getSipScoreId = (item: SipScoreWithEntries) => {
  const sip = (item.sip_score || {}) as Record<string, any>;
  return Number(sip.id || 0) || 0;
};

const getEntryParticipants = (entry: SipScoreEntry) => Number(entry.participant_num || 0);

const getEntryScoreNumber = (entry: SipScoreEntry) => {
  const participants = getEntryParticipants(entry);
  if (!participants) return null;
  return ((Number(entry.score_avg) || 0) / 100).toFixed(1);
};

type SipScoreCacheState = {
  items: SipScoreWithEntries[];
  sort: number;
  keyword: string;
  loaded: boolean;
  revision: number;
};

const sipScoreCache: SipScoreCacheState = {
  items: [],
  sort: SORT_TYPE.hottest,
  keyword: '',
  loaded: false,
  revision: 0,
};

const SipScore: React.FC = () => {
  const nav = useNavigate();
  const [items, setItems] = useState<SipScoreWithEntries[]>(sipScoreCache.items);
  const [sort, setSort] = useState<number>(sipScoreCache.sort);
  const [keyword, setKeyword] = useState(sipScoreCache.keyword);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(sipScoreCache.loaded);
  const [error, setError] = useState('');
  const [pressedCardKey, setPressedCardKey] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = keyword
        ? await mobileApi.sipScore.search({ keyword, sort_type: sort, page_size: 20 })
        : await mobileApi.sipScore.list({ sort_type: sort, page_size: 20 });
      if (res.code !== 0) {
        setError(res.message || '榜单加载失败');
        message.error(res.message || '榜单加载失败');
        return;
      }
      const nextItems = applyStoredSipScorePatches(res.data.sip_scores || [], {
        includeCreated: true,
      }).map((item) => {
        const sipId = getSipScoreId(item);
        return {
          ...item,
          entries: sipId
            ? applyStoredSipScoreEntryPatches(sipId, item.entries || [])
            : item.entries || [],
        };
      });
      setItems(nextItems);
      sipScoreCache.items = nextItems;
      sipScoreCache.sort = sort;
      sipScoreCache.keyword = keyword;
      sipScoreCache.loaded = true;
      sipScoreCache.revision = getSipScoreRevision();
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
      sipScoreCache.revision === getSipScoreRevision() &&
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

  useEffect(() => {
    const handleSipScorePatch = (event: Event) => {
      const patch = (event as CustomEvent<SipScorePatch>).detail;
      if (!patch?.id) return;
      setItems((current) => {
        const exists = current.some((item) => getSipScoreId(item) === Number(patch.id));
        const patched = current.map((item) => applySipScorePatch(item, patch));
        const nextItems =
          patch.created && patch.withEntries && !exists
            ? [patch.withEntries, ...patched]
            : patched;
        sipScoreCache.items = nextItems;
        sipScoreCache.revision = getSipScoreRevision();
        return nextItems;
      });
    };
    window.addEventListener(MOBILE_SIP_SCORE_EVENT, handleSipScorePatch);
    window.addEventListener(MOBILE_SIP_SCORE_CREATED_EVENT, handleSipScorePatch);
    return () => {
      window.removeEventListener(MOBILE_SIP_SCORE_EVENT, handleSipScorePatch);
      window.removeEventListener(MOBILE_SIP_SCORE_CREATED_EVENT, handleSipScorePatch);
    };
  }, []);

  useEffect(() => {
    const handleEntryPatch = (event: Event) => {
      const patch = (event as CustomEvent<SipScoreEntryPatch>).detail;
      if (!patch?.sipScoreId) return;
      setItems((current) => {
        const nextItems = current.map((item) => {
          if (getSipScoreId(item) !== Number(patch.sipScoreId)) return item;
          const entries = item.entries || [];
          const exists = entries.some(
            (entry) => Number(entry.id) === Number(patch.entryId),
          );
          return {
            ...item,
            sip_score: {
              ...(item.sip_score || {}),
              entry_count: Math.max(
                item.sip_score?.entry_count || entries.length || 0,
                patch.created ? entries.length + 1 : item.sip_score?.entry_count || 0,
              ),
            },
            entries:
              patch.created && patch.entry && !exists
                ? [patch.entry, ...entries].slice(0, PREVIEW_ENTRY_LIMIT)
                : applyStoredSipScoreEntryPatches(Number(patch.sipScoreId), entries),
          };
        });
        sipScoreCache.items = nextItems;
        sipScoreCache.revision = getSipScoreRevision();
        return nextItems;
      });
    };
    window.addEventListener(MOBILE_SIP_SCORE_ENTRY_EVENT, handleEntryPatch);
    return () =>
      window.removeEventListener(MOBILE_SIP_SCORE_ENTRY_EVENT, handleEntryPatch);
  }, []);

  const sortItems = useMemo(
    () => [
      { label: '热门', value: SORT_TYPE.hottest },
      { label: '最新', value: SORT_TYPE.newest },
    ],
    [],
  );

  return (
    <MobileShell title="茶评" showTopBar={false}>
      <PullToRefresh disabled={loading} onRefresh={load}>
        <Root>
          <Header>
            <HeaderTop>
              <h1>
                <img src={BRAND_LOGO} alt="" aria-hidden="true" />
                茶评
              </h1>
              <CreateButton type="button" onClick={() => nav('/sip-score/new')}>
                <img src={mastergoAssets.icons.addSmall} alt="" />
                建榜
              </CreateButton>
            </HeaderTop>
            <HeaderControls>
              <SearchBar
                defaultValue={keyword}
                placeholder="搜索榜单，如：奶茶新品"
                onSearch={setKeyword}
              />
              <SortRow aria-label="榜单排序">
                {sortItems.map((item) => (
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
            </HeaderControls>
          </Header>
          {items.length ? (
            <List>
              {items.map((item, index) => {
                const sip = item.sip_score || {};
                const sipId = getSipScoreId(item);
                const entries = (item.entries || []).slice(0, PREVIEW_ENTRY_LIMIT);
                const cardKey = sipId ? `sip-${sipId}` : `sip-${sip.name || index}`;
                return (
                  <Card
                    key={cardKey}
                    $pressed={pressedCardKey === cardKey}
                    role="button"
                    tabIndex={0}
                    onPointerDown={(event) => {
                      const target = event.target as HTMLElement;
                      if (target.closest('[data-card-child-action="true"]')) {
                        setPressedCardKey(null);
                        return;
                      }
                      setPressedCardKey(cardKey);
                    }}
                    onPointerUp={() => setPressedCardKey(null)}
                    onPointerCancel={() => setPressedCardKey(null)}
                    onPointerLeave={() => setPressedCardKey(null)}
                    onClick={() => sipId && nav(`/sip-score/${sipId}`)}
                    onKeyDown={(event) => {
                      if ((event.key === 'Enter' || event.key === ' ') && sipId) {
                        event.preventDefault();
                        nav(`/sip-score/${sipId}`);
                      }
                    }}
                  >
                    <CardHead>
                      <TitleGroup>
                        <h2>
                          <span>{sip.name || '未命名榜单'}</span>
                          <img src={mastergoAssets.icons.collectionSmallSquare} alt="" />
                        </h2>
                      </TitleGroup>
                      <DetailLink
                        data-card-child-action="true"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          if (sipId) nav(`/sip-score/${sipId}`);
                        }}
                      >
                        详情
                        <DesignIcon name="chevronRight" size={15} />
                      </DetailLink>
                    </CardHead>
                    {entries.length ? (
                      <EntryList>
                        {entries.map((entry) => {
                          const score = getEntryScoreNumber(entry);
                          const participants = getEntryParticipants(entry);
                          return (
                            <EntryRow
                              data-card-child-action="true"
                              key={entry.id || entry.name}
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                if (sipId && entry.id) {
                                  nav(`/sip-score/${sipId}/entry/${entry.id}`);
                                }
                              }}
                            >
                              <EntryCover>
                                <MobileImage
                                  src={entry.cover_img || sip.cover_img}
                                  fallbackText="茶评"
                                  radius={16}
                                />
                              </EntryCover>
                              <EntryMain>
                                <EntryTop>
                                  <div>
                                    <EntryName>{entry.name || '未命名项目'}</EntryName>
                                    <EntryMeta>
                                      <DesignIcon name="star" size={13} color="#ffb300" />
                                      <span>{score ? `${score} 分` : '暂无评分'}</span>
                                      <Dot />
                                      <span>{participants} 人参与</span>
                                    </EntryMeta>
                                  </div>
                                  <ScoreBadge>
                                    {score ? (
                                      score
                                    ) : (
                                      <span className="empty">待评分</span>
                                    )}
                                  </ScoreBadge>
                                </EntryTop>
                                <EntryDesc>
                                  {entry.description ||
                                    sip.description ||
                                    '还没有点评，来写第一条体验。'}
                                </EntryDesc>
                              </EntryMain>
                            </EntryRow>
                          );
                        })}
                      </EntryList>
                    ) : (
                      <EmptyPreview>
                        <h3>还没有评分对象</h3>
                        <p>
                          {sip.description ||
                            '进入榜单添加第一个对象，大家就能开始评分。'}
                        </p>
                      </EmptyPreview>
                    )}
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
        </Root>
      </PullToRefresh>
      <BackToTopButton offset={128} />
    </MobileShell>
  );
};

export default SipScore;
