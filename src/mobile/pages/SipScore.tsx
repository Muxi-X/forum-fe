import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import MobileShell from '../components/MobileShell';
import SearchBar from '../components/SearchBar';
import SegmentTabs from '../components/SegmentTabs';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import MobileImage from '../components/MobileImage';
import { mobileMotion, mobilePalette, CardSurface } from '../styles';
import { SORT_TYPE } from '../constants';
import { mobileApi, SipScoreWithEntries } from '../api';
import DesignIcon from '../components/DesignIcon';
import { mastergoAssets } from '../assets/mastergo';

const Header = styled.section`
  display: grid;
  grid-template-columns: 1fr 84px;
  gap: 14px;
  align-items: center;
  padding: 58px 22px 20px;
  background: #f9fafc;
`;

const List = styled.div`
  display: grid;
  gap: 16px;
  padding: 18px 20px 30px;
  background: ${mobilePalette.bg};
`;

const Card = styled(CardSurface)`
  display: block;
  padding: 16px 14px 20px;
  border: 0;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform ${mobileMotion.fast}, box-shadow ${mobileMotion.fast};
  &:active {
    transform: scale(0.985);
    box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
  }
`;

const Cover = styled.div`
  width: 72px;
  height: 72px;
  flex: 0 0 72px;
  border-radius: 10px;
  overflow: hidden;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
  h2 {
    margin: 0 0 6px;
    font-size: 16px;
    font-weight: 700;
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
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  margin-top: 8px;
  color: ${mobilePalette.muted};
  font-size: 12px;
`;

const EntryPreview = styled.div`
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #fff8e1;
  color: #795548;
  font-size: 12px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const CreateButton = styled.button`
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 999px;
  background: #fe9800;
  color: #fff;
  font-weight: 700;
  img {
    width: 14px;
    height: 14px;
    filter: brightness(0) invert(1);
  }
`;

const RankingTitle = styled.h2`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 14px;
  color: #1a202c;
  font-size: 20px;
  font-weight: 700;
  .more {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #6b7280;
    font-size: 12px;
    font-weight: 400;
  }
`;

const EntryRow = styled.div`
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  margin-top: 12px;
  min-width: 0;
`;

const SipScore: React.FC = () => {
  const nav = useNavigate();
  const [items, setItems] = useState<SipScoreWithEntries[]>([]);
  const [sort, setSort] = useState<number>(SORT_TYPE.newest);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
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
      setItems(res.data.sip_scores || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '榜单加载失败');
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  };

  useEffect(() => {
    load();
  }, [sort, keyword]);

  return (
    <MobileShell title="茶评" showTopBar={false}>
      <Header>
        <SearchBar defaultValue={keyword} placeholder="搜索榜单" onSearch={setKeyword} />
        <CreateButton type="button" onClick={() => nav('/sip-score/new')}>
          <img src={mastergoAssets.icons.addSmall} alt="" />
          建榜
        </CreateButton>
      </Header>
      <SegmentTabs
        value={sort}
        items={[
          { label: '最新', value: SORT_TYPE.newest },
          { label: '热门', value: SORT_TYPE.hottest },
        ]}
        onChange={(value) => setSort(Number(value))}
      />
      {items.length ? (
        <List>
          {items.map((item) => {
            const sip = item.sip_score || {};
            const entries = (item.entries || []).slice(0, 3);
            return (
              <Card key={sip.id} onClick={() => sip.id && nav(`/sip-score/${sip.id}`)}>
                <RankingTitle>
                  <span>
                    {sip.name || '未命名榜单'}
                    <img
                      src={mastergoAssets.icons.collectionSmallSquare}
                      alt=""
                      style={{ width: 11, height: 11, marginLeft: 6 }}
                    />
                  </span>
                  <span className="more">查看完整榜单 ›</span>
                </RankingTitle>
                {entries.length ? (
                  entries.map((entry) => (
                    <EntryRow key={entry.id || entry.name}>
                      <Cover>
                        <MobileImage
                          src={entry.cover_img || sip.cover_img}
                          fallbackText="茶评"
                          radius={10}
                        />
                      </Cover>
                      <Info>
                        <h2>{entry.name || '未命名项目'}</h2>
                        <Stats>
                          <span>
                            <DesignIcon name="star" size={13} color="#ffb300" />{' '}
                            {((entry.score_avg || 0) / 100).toFixed(1)}
                          </span>
                          <span>
                            {entry.participant_num || entry.participant_count || 0} 人参与
                          </span>
                        </Stats>
                        <EntryPreview>
                          {entry.description || sip.description || '暂无热评'}
                        </EntryPreview>
                      </Info>
                    </EntryRow>
                  ))
                ) : (
                  <EntryRow>
                    <Cover>
                      <MobileImage src={sip.cover_img} fallbackText="茶评" radius={10} />
                    </Cover>
                    <Info>
                      <h2>等待第一个评分对象</h2>
                      <p>{sip.description || '暂无简介'}</p>
                    </Info>
                  </EntryRow>
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
    </MobileShell>
  );
};

export default SipScore;
