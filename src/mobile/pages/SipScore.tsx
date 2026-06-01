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

const Header = styled.section`
  padding: 14px 16px 12px;
  background: ${mobilePalette.paper};
`;

const List = styled.div`
  display: grid;
  gap: 10px;
  padding: 12px;
`;

const Card = styled(CardSurface)`
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 12px;
  padding: 12px;
`;

const Cover = styled.div<{ src?: string }>`
  width: 88px;
  height: 88px;
  border-radius: 8px;
  background: ${(props) =>
    props.src
      ? `url(${props.src}) center/cover`
      : 'linear-gradient(135deg, #ffe8a8, #8bc6a4)'};
`;

const Info = styled.div`
  min-width: 0;
  h2 {
    margin: 0 0 6px;
    font-size: 16px;
    font-weight: 900;
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
  gap: 12px;
  margin-top: 10px;
  color: ${mobilePalette.muted};
  font-size: 12px;
`;

const EntryPreview = styled.div`
  margin-top: 8px;
  color: #68707d;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
    <MobileShell title="茶评" right="add" onRight={() => nav('/sip-score/new')}>
      <Header>
        <SearchBar defaultValue={keyword} placeholder="搜索榜单" onSearch={setKeyword} />
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
            const topEntries = (item.entries || [])
              .map((entry) => entry.name)
              .join(' / ');
            return (
              <Card key={sip.id} onClick={() => sip.id && nav(`/sip-score/${sip.id}`)}>
                <Cover src={sip.cover_img} />
                <Info>
                  <h2>{sip.name || '未命名榜单'}</h2>
                  <p>{sip.description || '暂无简介'}</p>
                  <Stats>
                    <span>{sip.entry_count || 0} 个对象</span>
                    <span>{sip.participant_count || 0} 人评分</span>
                    <span>{sip.collect_count || 0} 收藏</span>
                  </Stats>
                  {topEntries ? <EntryPreview>{topEntries}</EntryPreview> : null}
                </Info>
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
