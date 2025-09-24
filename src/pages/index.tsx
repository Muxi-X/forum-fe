import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { message, Tooltip } from 'antd';
import useDocTitle from 'hooks/useDocTitle';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useDebounceFn } from 'ahooks';
import ArticleList from 'components/List';
import BackToTop from 'components/BackTop';
import Tag from 'components/Tag/tag';
import { CATEGORY, CATEGORY_EN } from 'config';
import useRequest from 'hooks/useRequest';
import useList from 'store/useList';
import useProfile from 'store/useProfile';
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
  const { pathname, search } = location;
  const { setList, postList, getList } = useList();
  const {
    userProfile: { role, id },
  } = useProfile();
  const [hasMore, setHasMore] = useState(true); // 判断是否有更多文章
  const [tags, setTags] = useState<string[]>([]); // Tags表
  const [searchParams] = useSearchParams(); // query参数获取
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
  const [isFirst, setIsFirst] = useState(true); // 是否是第一次进入根路由

  const { domain, filter, tag, category, page } = getParams;

  const { run: tipNoMore } = useDebounceFn(
    () => {
      message.warning('没有更多文章了');
    },
    {
      wait: 1000,
    },
  );

  const { loading, run } = useRequest(API.post.getPostListByDomain.request, {
    onSuccess: (res) => {
      if (searchQuery) {
        useDocTitle(`${searchQuery} - 搜索 - 茶馆`);
        if (res.data.posts?.length === 0) {
          tipNoMore();
          setHasMore(false);
        } else setList([...postList, ...(res.data.posts as defs.post_Post[])]);
      } else {
        if (res.data.posts?.length === 0) {
          tipNoMore();
          setHasMore(false);
        } else {
          if (page === 0) setList(res.data.posts as defs.post_Post[]);
          else setList([...getList(), ...(res.data.posts as defs.post_Post[])]);
        }
      }
    },
    manual: true,
  });

  const { run: getTag } = useRequest(API.post.getPostPopular_tag.request, {
    manual: true,
    onSuccess: (res) => {
      const tagArray = res.data ? res.data : [];
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
    if (searchQuery) nav(`${search}&sort=hot`);
    else if (getParams.category) {
      const path = CATEGORY_EN[CATEGORY.indexOf(getParams.category)];
      history.pushState({ filter }, filter as string, `/${path}?sort=hot`);
    } else history.pushState({ filter }, filter as string, `/?sort=hot`);
  };

  const getArticleByTime = () => {
    if (getParams.filter === '') return;
    const { filter } = getParams;
    setHasMore(true);
    setList([]);
    setGetParams({ ...getParams, filter: '', page: 0 });
    history.pushState(
      filter,
      filter as string,
      `${pathname}${searchQuery ? '?query=' + searchQuery : ''}`,
    );
  };

  const handleGetCategory = (index: number) => {
    if (pathname === `/${CATEGORY_EN[index]}`) return;
    setList([]);
    setHasMore(true);
    setGetParams({
      ...getParams,
      category: CATEGORY[index],
      page: 0,
      filter: '',
      tag: '',
      domain: 'normal',
    });
    useDocTitle(CATEGORY[index] + ' - 茶馆');
    const category = CATEGORY_EN[index];
    history.pushState({ category }, category, `${category}`);
    getTag({ category: CATEGORY[index] });
  };

  const handleGetAll = () => {
    setHasMore(true);
    setTags([]);
    setGetParams({
      ...getParams,
      domain: 'normal',
      category: '',
      filter: '',
      tag: '',
      page: 0,
    });
    useDocTitle('木犀茶馆');
    history.pushState({ category: 'all' }, 'all', '/');
  };

  const handleChooseTag = (tag: string) => {
    if (getParams.tag === tag) return;
    setGetParams({ ...getParams, tag });
    setList([]);
    setHasMore(true);
  };

  useEffect(() => {
    if (pathname === '/' && filter === '') {
      handleGetAll();
    }
    if (searchQuery) {
      setList([]);
      setGetParams({ ...getParams, search_content: searchQuery });
      run({ ...getParams, search_content: searchQuery });
    } else if (getParams.category) {
      run(getParams);
    } else if (params.category && isFirst) {
      setIsFirst(false);
      const CN = CATEGORY[CATEGORY_EN.indexOf(params.category)];
      const i = CATEGORY_EN.indexOf(params.category as string);
      getTag({ category: CN });
      setGetParams({ ...getParams, category: CATEGORY[i] });
      useDocTitle(`${CN} - 茶馆`);
    } else {
      run(getParams);
      setTags([]);
      useDocTitle('木犀茶馆');
    }
    setIsFirst(false);
  }, [filter, category, tag, searchQuery, pathname, domain]);

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
        <Category trigger={pathname === '/'}>全部</Category>
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
          <Category trigger={pathname === `/${CATEGORY_EN[i]}`}>{category}</Category>
        </span>
      ))}
      {role?.includes('Muxi') ? (
        <Tooltip title="仅看团队内文章" placement="bottom" color="gold">
          <span
            onClick={() => {
              setList([]);
              setHasMore(true);
              setGetParams({
                ...getParams,
                domain: 'muxi',
                category: '',
                filter: '',
                tag: '',
                page: 0,
              });
              setTags([]);
              history.pushState({ domain: 'muxi' }, 'muxi', `muxi`);
              useDocTitle('都是自己人啦~');
            }}
            className="wrapper"
            aria-hidden="true"
          >
            <Category trigger={pathname === '/muxi'}>木犀</Category>
          </span>
        </Tooltip>
      ) : null}
    </Categories>
  );
  return (
    <>
      {searchQuery ? null : NavList}
      {tags?.length ? (
        <>
          <Tag
            tags={['全部']}
            onClick={() => {
              if (tag === '') return;
              setHasMore(true);
              setGetParams({ ...getParams, tag: '' });
              setList([]);
            }}
            type="filter"
            trigger={tag === ''}
          ></Tag>
          {tags.map((t, i) => (
            <Tag
              onClick={() => {
                handleChooseTag(t);
              }}
              trigger={t === tag}
              key={i}
              type="filter"
              tags={[t]}
            />
          ))}
        </>
      ) : null}
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
