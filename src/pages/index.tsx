import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { message } from 'antd';
import useDocTitle from 'hooks/useDocTitle';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import ArticleList from 'components/List';
import BackToTop from 'components/BackTop';
import Tag from 'components/Tag/tag';
import { CATEGORY, CATEGORY_EN } from 'config';
import useRequest from 'hooks/useRequest';
import useList from 'store/useList';
import media from 'styles/media';

type isTrigger = { trigger: boolean };

const { Category } = Tag;

const FilterWrapper = styled.div`
  background-color: white;
  padding: 12px 16px;
  user-select: none;
  span {
    padding: 0 1.2rem;
    cursor: pointer;
    :hover {
      color: rgba(255, 171, 0, 1);
    }
  }
  margin-bottom: 0.2rem;
`;
const Filter_Time = styled.span<isTrigger>`
  border-right: 1px solid hsla(0, 0%, 59.2%, 0.2);
  color: ${(props) => (props.trigger ? 'rgba(255, 171, 0, 1)' : '')};
`;
const Filter_Hot = styled.span<isTrigger>`
  color: ${(props) => (props.trigger ? 'rgba(255, 171, 0, 1)' : '')};
`;
const Categories = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 60vw;
  max-width: 960px;
  min-width: 375px;
  padding: 0 1rem;
  ${media.desktop`width: 100vw`}
  top: 5rem;
  .wrapper {
    margin: 0.5rem;
    ${media.phone`margin: 0`}
  }
  user-select: none;
`;

const Square: React.FC = () => {
  const { setList, postList } = useList();
  const [hasMore, setHasMore] = useState(true);
  const [triggerArray, setTriggerArray] = useState<boolean[]>(
    Array(CATEGORY.length).fill(false),
  );
  const [tags, setTags] = useState<{ tag: string; trigger: boolean }[]>([]);
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const params = useParams();
  const sort = searchParams.get('sort');
  const searchQuery = searchParams.get('query') ? searchParams.get('query') : '';
  const [getParams, setGetParams] = useState<API.post.getPostListByDomain.Params>({
    domain: 'normal',
    limit: 20,
    page: 0,
    filter: sort ? sort : '',
  });
  const [isAll, setIsAll] = useState(true);
  const [isFirst, setIsFirst] = useState(true);

  const { loading, run } = useRequest(API.post.getPostListByDomain.request, {
    onSuccess: (res) => {
      if (searchQuery) {
        useDocTitle(`${searchQuery} - 搜索 - 论坛`);
        if (res.data.posts?.length === 0) {
          message.warning('没有更多文章了');
          setHasMore(false);
        } else setList([...postList, ...(res.data.posts as defs.post_Post[])]);
      } else {
        if (res.data.posts?.length === 0) {
          message.warning('没有更多文章了');
          setHasMore(false);
        } else {
          setList([...postList, ...(res.data.posts as defs.post_Post[])]);
        }
      }
    },
    manual: true,
  });

  const { run: getTag } = useRequest(API.post.getPostPopular_tag.request, {
    manual: true,
    onSuccess: (res) => {
      const tagArray = res.data ? res.data.map((tag) => ({ tag, trigger: false })) : [];
      setTags(tagArray);
    },
  });

  const next = () => {
    const temp = (getParams.page as number) + 1;
    setGetParams({ ...getParams, page: temp });
    run({ ...getParams, page: temp });
  };

  const getArticleByHot = () => {
    if (getParams.filter === 'hot') return;
    const { filter } = getParams;
    setList([]);
    setHasMore(true);
    setGetParams({ ...getParams, filter: 'hot', page: 0 });
    if (searchQuery) nav(`${location.search}&sort=hot`);
    else if (getParams.category) {
      const path = CATEGORY_EN[CATEGORY.indexOf(getParams.category)];
      history.pushState({ filter }, filter as string, `/${path}?sort=hot`);
    } else history.pushState({ filter }, filter as string, `/?sort=hot`);
  };

  const getArticleByTime = () => {
    if (getParams.filter === null) return;
    const { filter } = getParams;
    setHasMore(true);
    setList([]);
    setGetParams({ ...getParams, filter: '', page: 0 });
    history.pushState(
      filter,
      filter as string,
      `${location.pathname}${searchQuery ? '?query=' + searchQuery : ''}`,
    );
  };

  const handleGetCategory = (index: number) => {
    const temp = [...triggerArray].fill(false);
    temp[index] = true;
    setTriggerArray(temp);
    setIsAll(false);
    setList([]);
    setHasMore(true);
    setGetParams({
      ...getParams,
      category: CATEGORY[index],
      page: 0,
      filter: '',
      tag: '',
    });
    useDocTitle(CATEGORY[index] + ' - 论坛');
    const category = CATEGORY_EN[index];
    history.pushState({ category }, category, `${category}`);
    getTag({ category: CATEGORY[index] });
  };

  const handleGetAll = () => {
    setIsAll(true);
    setHasMore(true);
    setTags([]);
    setTriggerArray(Array(CATEGORY.length).fill(false));
    setGetParams({ ...getParams, category: '', filter: '', tag: '', page: 0 });
    useDocTitle('木犀论坛');
    history.pushState({ category: 'all' }, 'all', '/');
  };

  const handleChooseTag = (tag: string, i: number) => {
    setGetParams({ ...getParams, tag });
    const temp = [...tags].map((t) => {
      return { trigger: false, tag: t.tag };
    });
    temp[i].trigger = true;
    setList([]);
    setTags(temp);
    setHasMore(true);
  };

  useEffect(() => {
    if (searchQuery) {
      setList([]);
      setGetParams({ ...getParams, search_content: searchQuery });
      run({ ...getParams, search_content: searchQuery });
    } else if (getParams.category) {
      run(getParams);
    } else if (params.category && isFirst) {
      setIsFirst(false);
      const temp = triggerArray.fill(false);
      const CN = CATEGORY[CATEGORY_EN.indexOf(params.category)];
      const i = CATEGORY_EN.indexOf(params.category as string);
      temp[i] = true;
      setTriggerArray(temp);
      setIsAll(false);
      getTag({ category: CN });
      setGetParams({ ...getParams, category: CATEGORY[i] });
      useDocTitle(`${CN} - 论坛`);
    } else {
      run(getParams);
      useDocTitle('木犀论坛');
    }
  }, [getParams.filter, getParams.category, getParams.tag, searchQuery]);

  const ListHeader = (
    <>
      <Filter_Time onClick={getArticleByTime} trigger={getParams.filter === ''}>
        实时
      </Filter_Time>
      <Filter_Hot onClick={getArticleByHot} trigger={getParams.filter === 'hot'}>
        热门
      </Filter_Hot>
    </>
  );

  const NavList = (
    <Categories>
      <span className="wrapper" aria-hidden="true" onClick={handleGetAll}>
        <Category trigger={isAll}>全部</Category>
      </span>
      {CATEGORY.map((category, i) => (
        <span
          aria-hidden="true"
          onClick={() => {
            handleGetCategory(i);
          }}
          className="wrapper"
          key={category}
        >
          <Category trigger={triggerArray[i]}>{category}</Category>
        </span>
      ))}
    </Categories>
  );

  return (
    <>
      {searchQuery ? null : NavList}
      {tags.map((tag, i) => (
        <Tag
          onClick={() => {
            handleChooseTag(tag.tag, i);
          }}
          trigger={tag.trigger}
          key={i}
          type="filter"
          tag={tag.tag}
        />
      ))}
      <FilterWrapper>{ListHeader}</FilterWrapper>
      <ArticleList
        hasMore={hasMore}
        run={next}
        list={postList}
        loading={loading && getParams.page === 0}
      />
      <BackToTop />
    </>
  );
};

export default Square;
