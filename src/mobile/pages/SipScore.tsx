import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import MobileShell from '../components/MobileShell';
import SearchBar from '../components/SearchBar';
import SegmentTabs from '../components/SegmentTabs';
import EmptyState from '../components/EmptyState';
import { mobilePalette, CardSurface } from '../styles';
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
  gap: 40px;
  padding: 18px 20px 30px;
  background: #fff;
`;

const Card = styled(CardSurface)`
  display: block;
  padding: 16px 14px 20px;
  border: 0;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const Cover = styled.div<{ src?: string }>`
  width: 84px;
  height: 80px;
  flex: 0 0 84px;
  border-radius: 10px;
  background: ${(props) => (props.src ? `url(${props.src}) center/cover` : '#fcf4d4')};
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
  justify-content: flex-end;
  gap: 4px;
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
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #6b7280;
    font-size: 12px;
    font-weight: 400;
  }
`;

const EntryRow = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 12px;
  min-width: 0;
`;

const Score = styled.strong`
  flex: 0 0 auto;
  margin-left: auto;
  color: #ffc641;
  font-size: 32px;
  line-height: 1;
`;

const SipScore: React.FC = () => {
  const nav = useNavigate();
  const [items, setItems] = useState<SipScoreWithEntries[]>([]);
  const [sort, setSort] = useState<number>(SORT_TYPE.newest);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = keyword
        ? await mobileApi.sipScore.search({ keyword, page_size: 20 })
        : await mobileApi.sipScore.list({ sort_type: sort, page_size: 20 });
      if (res.code !== 0) {
        message.error(res.message);
        return;
      }
      setItems(res.data.sip_scores || []);
    } finally {
      setLoading(false);
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
                      <Cover src={entry.cover_img || sip.cover_img} />
                      <Info>
                        <h2>{entry.name || '未命名项目'}</h2>
                        <Stats>
                          <span>
                            <DesignIcon name="star" size={13} color="#ffb300" />{' '}
                            {((entry.score_avg || 490) / 100).toFixed(1)}
                          </span>
                          <span>
                            {entry.participant_num || entry.participant_count || 0} 人参与
                          </span>
                        </Stats>
                        <EntryPreview>
                          {entry.description || sip.description || '暂无热评'}
                        </EntryPreview>
                      </Info>
                      <Score>{((entry.score_avg || 490) / 100).toFixed(1)}</Score>
                    </EntryRow>
                  ))
                ) : (
                  <EntryRow>
                    <Cover src={sip.cover_img} />
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
      ) : (
        <EmptyState text={loading ? '加载中...' : '还没有榜单'} />
      )}
    </MobileShell>
  );
};

export default SipScore;
