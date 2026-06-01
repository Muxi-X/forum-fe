import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input, message } from 'antd';
import { useParams } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import StarRating from '../components/StarRating';
import UploadField from '../components/UploadField';
import EmptyState from '../components/EmptyState';
import { mobilePalette, PrimaryButton, CardSurface } from '../styles';
import { SORT_TYPE } from '../constants';
import { mobileApi, SipScoreEntry, SipScoreRating } from '../api';
import moment from 'utils/moment';

const Hero = styled.section`
  background: ${mobilePalette.paper};
  padding: 16px;
`;

const Cover = styled.div<{ src?: string }>`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  background: ${(props) =>
    props.src
      ? `url(${props.src}) center/cover`
      : 'linear-gradient(135deg, #ffe8a8, #8bc6a4)'};
`;

const Title = styled.h1`
  margin: 14px 0 6px;
  font-size: 22px;
  font-weight: 900;
`;

const Muted = styled.p`
  margin: 0;
  color: ${mobilePalette.muted};
  line-height: 1.55;
`;

const RateBox = styled(CardSurface)`
  margin: 12px;
  padding: 14px;
  display: grid;
  gap: 10px;
`;

const RatingList = styled.div`
  display: grid;
  gap: 10px;
  padding: 0 12px 20px;
`;

const RatingCard = styled(CardSurface)`
  padding: 12px;
`;

const RatingHead = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${mobilePalette.muted};
  font-size: 12px;
  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const EntryDetail: React.FC = () => {
  const { id, entryId } = useParams();
  const sipScoreId = Number(id);
  const scoreEntryId = Number(entryId);
  const [entry, setEntry] = useState<SipScoreEntry | null>(null);
  const [ratings, setRatings] = useState<SipScoreRating[]>([]);
  const [myRating, setMyRating] = useState<SipScoreRating | null>(null);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [img, setImg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const detail = await mobileApi.sipScore.entryDetail(sipScoreId, scoreEntryId);
    if (detail.code === 0) {
      setEntry(detail.data.entry || null);
      setMyRating(detail.data.my_rating || null);
      if (detail.data.my_rating?.rating) setScore(detail.data.my_rating.rating);
    }
    const list = await mobileApi.sipScore.ratings(sipScoreId, scoreEntryId, {
      sort_type: SORT_TYPE.newest,
      page_size: 30,
    });
    if (list.code === 0) setRatings(list.data.ratings || []);
  };

  useEffect(() => {
    if (sipScoreId && scoreEntryId) load();
  }, [sipScoreId, scoreEntryId]);

  const submit = async () => {
    if (!comment.trim()) {
      message.warning('请写点评内容');
      return;
    }
    setSubmitting(true);
    try {
      const res = await mobileApi.sipScore.rateEntry({
        sip_score_id: sipScoreId,
        entry_id: scoreEntryId,
        rating: score,
        comment,
        img_url: img,
      });
      if (res.code !== 0) {
        message.error(res.message);
        return;
      }
      message.success('评分成功');
      setComment('');
      setImg('');
      load();
    } finally {
      setSubmitting(false);
    }
  };

  if (!entry) {
    return (
      <MobileShell title="评分对象" back tabs={false}>
        <EmptyState text="加载中..." />
      </MobileShell>
    );
  }

  return (
    <MobileShell title="评分对象" back tabs={false}>
      <Hero>
        <Cover src={entry.cover_img} />
        <Title>{entry.name}</Title>
        <Muted>{entry.description || '暂无简介'}</Muted>
        <Muted style={{ marginTop: 8 }}>
          {((entry.score_avg || 0) / 100).toFixed(1)} 分 ·{' '}
          {entry.participant_num || entry.participant_count || 0} 人评分
        </Muted>
      </Hero>
      <RateBox>
        <strong>{myRating ? '你已评分' : '我的评分'}</strong>
        <StarRating value={score} onChange={setScore} />
        {!myRating ? (
          <>
            <Input.TextArea
              rows={4}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="写下你的体验"
            />
            <UploadField value={img} onChange={setImg} />
            <PrimaryButton disabled={submitting} onClick={submit}>
              {submitting ? '提交中...' : '提交评分'}
            </PrimaryButton>
          </>
        ) : (
          <Muted>{myRating.content}</Muted>
        )}
      </RateBox>
      {ratings.length ? (
        <RatingList>
          {ratings.map((rating) => (
            <RatingCard key={rating.id}>
              <RatingHead>
                <img
                  src={
                    rating.creator?.avatar ||
                    'https://ossforum.muxixyz.com/default/avatar.png'
                  }
                  alt=""
                />
                <strong>{rating.creator?.name || '茶友'}</strong>
                <span>
                  {rating.created_at ? moment(rating.created_at).fromNow() : ''}
                </span>
              </RatingHead>
              <div style={{ marginTop: 8 }}>
                <StarRating value={rating.rating || 0} />
              </div>
              <Muted style={{ color: mobilePalette.ink, marginTop: 8 }}>
                {rating.content}
              </Muted>
              {rating.img_url ? (
                <img
                  src={rating.img_url}
                  alt=""
                  style={{
                    width: 96,
                    height: 96,
                    objectFit: 'cover',
                    borderRadius: 8,
                    marginTop: 8,
                  }}
                />
              ) : null}
            </RatingCard>
          ))}
        </RatingList>
      ) : (
        <EmptyState text="还没有点评" />
      )}
    </MobileShell>
  );
};

export default EntryDetail;
