import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input, message } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import StarRating from '../components/StarRating';
import UploadField from '../components/UploadField';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import MobileAvatar from '../components/MobileAvatar';
import MobileImage from '../components/MobileImage';
import MobileBottomSheet from '../components/MobileBottomSheet';
import { mobilePalette, mobileRadius, PrimaryButton, CardSurface } from '../styles';
import { SORT_TYPE, TYPE_NAME } from '../constants';
import { mobileApi, SipScore, SipScoreEntry, SipScoreRating } from '../api';
import DesignIcon from '../components/DesignIcon';
import { emitSipScoreEntryPatch } from '../postEvents';
import moment from 'utils/moment';

const Page = styled.div`
  min-height: 100%;
  padding-bottom: calc(98px + env(safe-area-inset-bottom));
  background: ${mobilePalette.bg};
`;

const Hero = styled.section`
  padding: 18px 20px;
  background: linear-gradient(180deg, #fffaf0 0%, #fff 100%);
`;

const Intro = styled.div`
  display: grid;
  grid-template-columns: 108px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
`;

const Cover = styled.div`
  width: 108px;
  height: 132px;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 16px 30px rgba(16, 24, 40, 0.12);
`;

const TitleWrap = styled.div`
  min-width: 0;
  h1 {
    margin: 4px 0 8px;
    color: ${mobilePalette.ink};
    font-size: 24px;
    font-weight: 850;
    line-height: 1.22;
    letter-spacing: 0;
  }
  p {
    margin: 0;
    color: ${mobilePalette.muted};
    font-size: 13px;
    line-height: 1.5;
  }
`;

const Source = styled.button`
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0;
  background: transparent;
  color: ${mobilePalette.orange};
  font-size: 13px;
  font-weight: 800;
  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ScoreCard = styled(CardSurface)`
  margin-top: 16px;
  padding: 15px 16px;
  border: 0;
  border-radius: 22px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 12px 28px rgba(16, 24, 40, 0.055);
`;

const ScoreNumber = styled.div`
  min-width: 70px;
  color: ${mobilePalette.orange};
  font-size: 33px;
  font-weight: 900;
  line-height: 1;
  text-align: center;
  span {
    display: block;
    margin-top: 5px;
    color: ${mobilePalette.muted};
    font-size: 12px;
    font-weight: 700;
  }
`;

const Section = styled.section`
  padding: 0 16px;
  margin-top: 14px;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 0 4px 10px;
  h2 {
    margin: 0;
    color: ${mobilePalette.ink};
    font-size: 18px;
    font-weight: 850;
    line-height: 1.3;
  }
  span,
  button {
    color: ${mobilePalette.muted};
    font-size: 13px;
    font-weight: 700;
  }
  button {
    background: transparent;
  }
`;

const MyRatingCard = styled(CardSurface)`
  padding: 16px;
  border: 0;
  border-radius: 24px;
  background: ${mobilePalette.paper};
  box-shadow: 0 12px 28px rgba(16, 24, 40, 0.055);
`;

const MyRatingTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const EditRating = styled.button`
  height: 34px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 12px;
  border-radius: ${mobileRadius.pill};
  background: rgba(255, 198, 65, 0.18);
  color: #a15a00;
  font-size: 13px;
  font-weight: 850;
`;

const RatingText = styled.p`
  margin: 10px 0 0;
  color: ${mobilePalette.inkSoft};
  font-size: 14px;
  line-height: 1.55;
  white-space: pre-wrap;
`;

const Featured = styled(MyRatingCard)`
  background: linear-gradient(135deg, #fff8df 0%, #fffaf0 100%);
`;

const RatingList = styled.div`
  display: grid;
  gap: 12px;
`;

const RatingCard = styled(CardSurface)`
  padding: 15px;
  border: 0;
  border-radius: 22px;
  box-shadow: 0 10px 26px rgba(16, 24, 40, 0.05);
`;

const RatingHead = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
`;

const UserMeta = styled.div`
  min-width: 0;
  flex: 1;
  strong {
    display: block;
    color: ${mobilePalette.ink};
    font-size: 14px;
    font-weight: 800;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  span {
    color: ${mobilePalette.muted};
    font-size: 12px;
  }
`;

const LikeButton = styled.button<{ active?: boolean }>`
  height: 32px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 10px;
  border-radius: ${mobileRadius.pill};
  background: ${(props) => (props.active ? 'rgba(255,198,65,0.18)' : 'transparent')};
  color: ${(props) => (props.active ? mobilePalette.orange : mobilePalette.muted)};
  font-size: 12px;
  font-weight: 800;
`;

const RatingImage = styled.img`
  width: 96px;
  height: 96px;
  display: block;
  object-fit: cover;
  border-radius: 16px;
  margin-top: 10px;
`;

const SortRow = styled.div`
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid rgba(60, 60, 67, 0.08);
  border-radius: ${mobileRadius.pill};
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 8px 22px rgba(16, 24, 40, 0.045);
`;

const SortButton = styled.button<{ active: boolean }>`
  min-width: 58px;
  height: 32px;
  padding: 0 14px;
  border-radius: ${mobileRadius.pill};
  background: ${(props) => (props.active ? '#fff' : 'transparent')};
  color: ${(props) => (props.active ? mobilePalette.orange : mobilePalette.muted)};
  font-weight: ${(props) => (props.active ? 850 : 650)};
  box-shadow: ${(props) =>
    props.active ? '0 7px 16px rgba(254, 152, 0, 0.14)' : 'none'};
`;

const FixedAction = styled.div`
  position: fixed;
  left: 50%;
  bottom: calc(18px + env(safe-area-inset-bottom));
  z-index: 52;
  width: min(420px, calc(100% - 32px));
  transform: translateX(-50%);
  pointer-events: none;
  button {
    width: 100%;
    height: 52px;
    pointer-events: auto;
  }
`;

const SheetForm = styled.div`
  display: grid;
  gap: 13px;
  .ant-input,
  .ant-input-affix-wrapper {
    border-radius: ${mobileRadius.lg};
    border-color: rgba(60, 60, 67, 0.12);
    box-shadow: 0 8px 20px rgba(16, 24, 40, 0.04);
  }
`;

const SheetStars = styled.div`
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 6px 0 2px;
  strong {
    color: ${mobilePalette.ink};
    font-size: 15px;
  }
`;

const getParticipants = (entry?: SipScoreEntry | null) =>
  Number(entry?.participant_num || 0);

const getScoreText = (entry?: SipScoreEntry | null) => {
  if (!getParticipants(entry)) return '--';
  return ((Number(entry?.score_avg) || 0) / 100).toFixed(1);
};

const getRatingAuthor = (rating?: SipScoreRating | null) =>
  rating?.creator?.name || '茶友';

const pickFeaturedRating = (items: SipScoreRating[]) => {
  if (!items.length) return null;
  const top = items.reduce((best, item) =>
    Number(item.like_num || 0) > Number(best.like_num || 0) ? item : best,
  );
  return Number(top.like_num || 0) > 0 ? top : null;
};

const EntryDetail: React.FC = () => {
  const { id, entryId } = useParams();
  const location = useLocation();
  const nav = useNavigate();
  const sipScoreId = Number(id);
  const scoreEntryId = Number(entryId);
  const [sipScore, setSipScore] = useState<SipScore | null>(null);
  const [entry, setEntry] = useState<SipScoreEntry | null>(null);
  const [ratings, setRatings] = useState<SipScoreRating[]>([]);
  const [featuredRating, setFeaturedRating] = useState<SipScoreRating | null>(null);
  const [myRating, setMyRating] = useState<SipScoreRating | null>(null);
  const [ratingSort, setRatingSort] = useState<number>(SORT_TYPE.hottest);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [img, setImg] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEntry = useCallback(async () => {
    setLoading(true);
    setError('');
    let syncedEntry: SipScoreEntry | null = null;
    try {
      const [meta, detail] = await Promise.all([
        mobileApi.sipScore.get(sipScoreId),
        mobileApi.sipScore.entryDetail(sipScoreId, scoreEntryId),
      ]);
      if (meta.code === 0) setSipScore(meta.data.sip_score || null);
      if (detail.code === 0) {
        const nextEntry = detail.data.entry || null;
        const nextMyRating = detail.data.my_rating || null;
        syncedEntry = nextEntry;
        setEntry(nextEntry);
        setMyRating(nextMyRating);
        if (nextMyRating?.rating) {
          setScore(nextMyRating.rating);
          setComment(nextMyRating.content || '');
          setImg(nextMyRating.img_url || '');
        }
      } else {
        setError(detail.message || '评分对象加载失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '评分对象加载失败');
    } finally {
      setLoading(false);
    }
    return syncedEntry;
  }, [sipScoreId, scoreEntryId]);

  const loadRatings = useCallback(async () => {
    try {
      const [list, featuredList] = await Promise.all([
        mobileApi.sipScore.ratings(sipScoreId, scoreEntryId, {
          sort_type: ratingSort,
          page_size: 30,
        }),
        mobileApi.sipScore.ratings(sipScoreId, scoreEntryId, {
          sort_type: SORT_TYPE.hottest,
          page_size: 20,
        }),
      ]);
      const nextRatings = list.code === 0 ? list.data.ratings || [] : [];
      const nextFeaturedRatings =
        featuredList.code === 0 ? featuredList.data.ratings || [] : [];
      if (list.code === 0) setRatings(nextRatings);
      if (featuredList.code === 0) {
        setFeaturedRating(pickFeaturedRating(nextFeaturedRatings));
      } else {
        setFeaturedRating(null);
      }
      setLikedIds((prev) => {
        const next = new Set(prev);
        [...nextRatings, ...nextFeaturedRatings].forEach((rating) => {
          if (!rating.id) return;
          if (rating.is_liked) next.add(rating.id);
          else next.delete(rating.id);
        });
        return next;
      });
    } catch {
      setFeaturedRating(null);
    }
  }, [sipScoreId, scoreEntryId, ratingSort]);

  useEffect(() => {
    if (sipScoreId && scoreEntryId) void loadEntry();
  }, [sipScoreId, scoreEntryId, loadEntry]);

  useEffect(() => {
    if (sipScoreId && scoreEntryId && entry) void loadRatings();
  }, [sipScoreId, scoreEntryId, entry?.id, loadRatings]);

  useEffect(() => {
    const state = location.state as { openRating?: boolean } | null;
    if (state?.openRating) setSheetOpen(true);
  }, [location.state]);

  const openRatingSheet = () => {
    if (myRating) {
      setScore(myRating.rating || 5);
      setComment(myRating.content || '');
      setImg(myRating.img_url || '');
    } else {
      setScore(5);
      setComment('');
      setImg('');
    }
    setSheetOpen(true);
  };

  const submit = async () => {
    if (!comment.trim()) {
      message.warning('请写点评内容');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        sip_score_id: sipScoreId,
        entry_id: scoreEntryId,
        rating: score,
        img_url: img,
      };
      const res = myRating?.id
        ? await mobileApi.sipScore.updateRating({
            ...payload,
            rating_id: myRating.id,
            content: comment.trim(),
          })
        : await mobileApi.sipScore.rateEntry({
            ...payload,
            comment: comment.trim(),
          });
      if (res.code !== 0) {
        message.error(res.message || '提交失败');
        return;
      }
      message.success(myRating ? '评分已更新' : '评分成功');
      setSheetOpen(false);
      const syncedEntry = await loadEntry();
      void loadRatings();
      emitSipScoreEntryPatch({
        sipScoreId,
        entryId: scoreEntryId,
        entry: syncedEntry || undefined,
        score_avg: syncedEntry?.score_avg,
        participant_num: syncedEntry?.participant_num,
        comment_num: syncedEntry?.comment_num,
        rated: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const likeRating = async (rating: SipScoreRating) => {
    if (!rating.id) return;
    const nextLiked = !likedIds.has(rating.id);
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (nextLiked) next.add(rating.id!);
      else next.delete(rating.id!);
      return next;
    });
    setRatings((prev) =>
      prev.map((item) =>
        item.id === rating.id
          ? {
              ...item,
              like_num: Math.max(0, Number(item.like_num || 0) + (nextLiked ? 1 : -1)),
            }
          : item,
      ),
    );
    setFeaturedRating((prev) => {
      if (!prev || prev.id !== rating.id) return prev;
      return {
        ...prev,
        like_num: Math.max(0, Number(prev.like_num || 0) + (nextLiked ? 1 : -1)),
      };
    });
    const res = await mobileApi.like(rating.id, TYPE_NAME.sipScoreEntryCommentRating);
    if (res.code !== 0) {
      message.error(res.message || '点赞失败');
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (nextLiked) next.delete(rating.id!);
        else next.add(rating.id!);
        return next;
      });
      setRatings((prev) =>
        prev.map((item) =>
          item.id === rating.id
            ? {
                ...item,
                like_num: Math.max(0, Number(item.like_num || 0) + (nextLiked ? -1 : 1)),
              }
            : item,
        ),
      );
      setFeaturedRating((prev) => {
        if (!prev || prev.id !== rating.id) return prev;
        return {
          ...prev,
          like_num: Math.max(0, Number(prev.like_num || 0) + (nextLiked ? -1 : 1)),
        };
      });
    }
  };

  const renderRating = (rating: SipScoreRating, featuredCard = false) => {
    const CardComponent = featuredCard ? Featured : RatingCard;
    return (
      <CardComponent key={rating.id || `${rating.creator?.id}-${rating.created_at}`}>
        <RatingHead>
          <MobileAvatar url={rating.creator?.avatar} size={34} />
          <UserMeta>
            <strong>{getRatingAuthor(rating)}</strong>
            <span>
              {rating.created_at ? moment(rating.created_at).fromNow() : '刚刚'}
            </span>
          </UserMeta>
          <StarRating value={rating.rating || 0} size={13} readonly />
        </RatingHead>
        <RatingText>{rating.content || '这个茶友只留下了星星。'}</RatingText>
        {rating.img_url ? <RatingImage src={rating.img_url} alt="" /> : null}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <LikeButton
            type="button"
            active={likedIds.has(rating.id || 0)}
            onClick={() => likeRating(rating)}
          >
            <DesignIcon
              name="like"
              size={16}
              color={
                likedIds.has(rating.id || 0) ? mobilePalette.orange : mobilePalette.muted
              }
            />
            {rating.like_num || 0}
          </LikeButton>
        </div>
      </CardComponent>
    );
  };

  if (loading && !entry) {
    return (
      <MobileShell title="项目详情" back tabs={false}>
        <LoadingState text="正在打开评分对象..." />
      </MobileShell>
    );
  }

  if (error && !entry) {
    return (
      <MobileShell title="项目详情" back tabs={false}>
        <ErrorState text={error} onRetry={loadEntry} />
      </MobileShell>
    );
  }

  if (!entry) return null;

  const participants = getParticipants(entry);
  const scoreText = getScoreText(entry);

  return (
    <MobileShell title="项目详情" back tabs={false}>
      <Page>
        <Hero>
          <Intro>
            <Cover>
              <MobileImage src={entry.cover_img} fallbackText="项目" radius={22} />
            </Cover>
            <TitleWrap>
              <h1>{entry.name || '未命名项目'}</h1>
              {sipScore ? (
                <Source type="button" onClick={() => nav(`/sip-score/${sipScoreId}`)}>
                  来自 <span>{sipScore.name || '榜单'}</span>
                  <DesignIcon
                    name="chevronRight"
                    size={13}
                    color={mobilePalette.orange}
                  />
                </Source>
              ) : null}
              <p>{entry.description || '暂无简介'}</p>
            </TitleWrap>
          </Intro>
          <ScoreCard>
            <ScoreNumber>
              {scoreText}
              <span>{participants ? `${participants} 人参与` : '等待评分'}</span>
            </ScoreNumber>
            <div>
              <StarRating
                value={scoreText === '--' ? 0 : Math.round(Number(scoreText))}
                size={20}
                readonly
              />
              <p
                style={{ margin: '8px 0 0', color: mobilePalette.muted, lineHeight: 1.5 }}
              >
                综合评分来自所有茶友的打分，满分 5 分。
              </p>
            </div>
          </ScoreCard>
        </Hero>

        <Section>
          <SectionTitle>
            <h2>我的评分</h2>
          </SectionTitle>
          <MyRatingCard>
            <MyRatingTop>
              <StarRating value={myRating?.rating || 0} size={20} readonly />
              <EditRating type="button" onClick={openRatingSheet}>
                {myRating ? '修改评分' : '写评分'}
                <DesignIcon name="chevronRight" size={13} color="#a15a00" />
              </EditRating>
            </MyRatingTop>
            <RatingText>
              {myRating?.content || '还没有留下你的体验。写几句，后来的茶友会很感谢。'}
            </RatingText>
            {myRating?.img_url ? <RatingImage src={myRating.img_url} alt="" /> : null}
          </MyRatingCard>
        </Section>

        {featuredRating ? (
          <Section>
            <SectionTitle>
              <h2>精选热评</h2>
              <span>{Number(featuredRating.like_num || 0)} 赞</span>
            </SectionTitle>
            {renderRating(featuredRating, true)}
          </Section>
        ) : null}

        <Section>
          <SectionTitle>
            <h2>大家怎么说</h2>
            <SortRow>
              {[
                { label: '最热', value: SORT_TYPE.hottest },
                { label: '最新', value: SORT_TYPE.newest },
              ].map((item) => (
                <SortButton
                  key={item.value}
                  type="button"
                  active={ratingSort === item.value}
                  onClick={() => setRatingSort(item.value)}
                >
                  {item.label}
                </SortButton>
              ))}
            </SortRow>
          </SectionTitle>
          {ratings.length ? (
            <RatingList>{ratings.map((rating) => renderRating(rating))}</RatingList>
          ) : (
            <EmptyState title="还没有点评" text="写下第一条体验，给后来的人一点参考。" />
          )}
        </Section>

        <FixedAction>
          <PrimaryButton type="button" onClick={openRatingSheet}>
            {myRating ? '修改我的评分' : '写点评'}
          </PrimaryButton>
        </FixedAction>
      </Page>
      <MobileBottomSheet
        open={sheetOpen}
        title={myRating ? '修改评分' : '写点评'}
        onClose={() => setSheetOpen(false)}
      >
        <SheetForm>
          <SheetStars>
            <strong>{entry.name}</strong>
            <StarRating value={score} onChange={setScore} size={30} />
          </SheetStars>
          <Input.TextArea
            rows={5}
            maxLength={600}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="写下你的体验、推荐理由或避坑点"
          />
          <UploadField value={img} onChange={setImg} label="上传图片（可选）" />
          <PrimaryButton type="button" disabled={submitting} onClick={submit}>
            {submitting ? '提交中...' : myRating ? '保存修改' : '提交评分'}
          </PrimaryButton>
        </SheetForm>
      </MobileBottomSheet>
    </MobileShell>
  );
};

export default EntryDetail;
