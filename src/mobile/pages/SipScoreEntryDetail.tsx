import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input, message } from 'antd';
import { useParams } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import StarRating from '../components/StarRating';
import UploadField from '../components/UploadField';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import MobileAvatar from '../components/MobileAvatar';
import MobileImage from '../components/MobileImage';
import { mobilePalette, mobileRadius, PrimaryButton, CardSurface } from '../styles';
import { SORT_TYPE } from '../constants';
import { mobileApi, SipScoreEntry, SipScoreRating } from '../api';
import moment from 'utils/moment';

const Hero = styled.section`
  background: linear-gradient(180deg, #fffaf0 0%, #fff 100%);
  padding: 18px 20px;
  overflow: hidden;
`;

const Cover = styled.div`
  width: 86px;
  height: 86px;
  float: left;
  margin: 0 14px 12px 0;
  border-radius: 20px;
  overflow: hidden;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 22px;
  line-height: 1.25;
  font-weight: 800;
`;

const Muted = styled.p`
  margin: 0;
  color: ${mobilePalette.muted};
  line-height: 1.55;
`;

const RateBox = styled(CardSurface)`
  margin: 12px 14px;
  padding: 16px;
  display: grid;
  gap: 10px;
  border: 0;
  border-radius: 22px;
  box-shadow: 0 12px 30px rgba(16, 24, 40, 0.06);
`;

const RatingList = styled.div`
  display: grid;
  gap: 12px;
  padding: 0 14px 24px;
`;

const RatingCard = styled(CardSurface)`
  padding: 14px;
  border: 0;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.05);
`;

const RatingHead = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${mobilePalette.muted};
  font-size: 12px;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const detail = await mobileApi.sipScore.entryDetail(sipScoreId, scoreEntryId);
      if (detail.code === 0) {
        setEntry(detail.data.entry || null);
        setMyRating(detail.data.my_rating || null);
        if (detail.data.my_rating?.rating) setScore(detail.data.my_rating.rating);
      } else {
        setError(detail.message || '评分对象加载失败');
      }
      const list = await mobileApi.sipScore.ratings(sipScoreId, scoreEntryId, {
        sort_type: SORT_TYPE.newest,
        page_size: 30,
      });
      if (list.code === 0) setRatings(list.data.ratings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '评分对象加载失败');
    } finally {
      setLoading(false);
    }
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

  if (loading && !entry) {
    return (
      <MobileShell title="评分对象" back tabs={false}>
        <LoadingState text="正在打开评分对象..." />
      </MobileShell>
    );
  }

  if (error && !entry) {
    return (
      <MobileShell title="评分对象" back tabs={false}>
        <ErrorState text={error} onRetry={load} />
      </MobileShell>
    );
  }

  if (!entry) return null;

  return (
    <MobileShell title="评分对象" back tabs={false}>
      <Hero>
        <Cover>
          <MobileImage src={entry.cover_img} fallbackText="项目" radius={8} />
        </Cover>
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
                <MobileAvatar url={rating.creator?.avatar} size={28} />
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
        <EmptyState title="还没有点评" text="写下第一条体验，给后来的人一点参考。" />
      )}
    </MobileShell>
  );
};

export default EntryDetail;
