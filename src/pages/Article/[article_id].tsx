import React, { useEffect, useRef, useState } from 'react';
import moment from 'utils/moment';
import { useParams } from 'react-router';
import MarkdownNavbar from 'markdown-navbar';
import {
  LikeFilled,
  StarFilled,
  MessageFilled,
  ShareAltOutlined,
} from '@ant-design/icons';
import { Card, Affix, Badge } from 'antd';
import useRequest from 'hooks/useRequest';
import styled from 'styled-components';
import Loading from 'components/Loading';
import Avatar from 'components/Avatar/avatar';
import BackToTop from 'components/BackTop';
import Tag from 'components/Tag/tag';
import Comment from './components/comment';
import media from 'styles/media';
import 'markdown-navbar/dist/navbar.css';
import * as style from './style';
import 'assets/theme/theme.less';

interface ActionProps {
  done?: boolean;
}

const { Category } = Tag;

const Navigation = styled(Card)`
  height: 300px;
  width: 350px;
  overflow: scroll;
  position: sticky;
  top: 0vh;
`;

const ArticleCard = styled(Card)`
  width: 100%;
  padding-left: 2em;
  padding-right: 2em;
  margin-bottom: 1em;
  a {
    cursor: pointer;
  }
  h1 {
    font-size: 2.4em;
  }
`;

const ArticleCategory = styled(Category)`
  margin: 10px;
  margin-right: 4em;
`;

const ActionWrapper = styled(Affix)`
  position: absolute;
  left: 10%;
  user-select: none;
  ${media.desktop`visibility: hidden`}
`;

const Action = styled.div<ActionProps>`
  background-color: white;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 4%);
  cursor: pointer;
  text-align: center;
  font-size: 1.67rem;
  line-height: 4rem;
  color: ${(props) => (props.done ? 'gold' : `#8a919f`)};
  ${(prop) =>
    prop.done
      ? ''
      : `  :hover {
    color: rgb(64, 69, 84);
  }`}
`;

const Article: React.FC = () => {
  const [articleInfo, setArticleInfo] = useState<defs.post_GetPostResponse>({});
  const [navBar, setNavBar] = useState({ show: false, content: '' });
  const ref = useRef<HTMLDivElement>();
  const { article_id } = useParams();

  const {
    content_type,
    creator_name,
    creator_avatar,
    creator_id,
    compiled_content,
    category,
    tags,
    time,
    content,
    sub_posts,
    is_collection,
    is_liked,
    like_num,
    collection_num,
    comment_num,
  } = articleInfo;

  useEffect(() => {
    if (document.body.scrollHeight < window.innerHeight * 3) {
      setNavBar({ show: false, content: '' });
    }
  }, [navBar.show]);

  const { loading } = useRequest(
    () =>
      API.post.getPostByPost_id.request({
        post_id: +(article_id as string),
      }),
    {
      onSuccess: (response) => {
        // 目录生成逻辑 如果是markdown 就用markdown源码进行 而如果是富文本的话则用Turndown逆解析后再使用
        // 这里都要加上title的话是因为这个Navbar组件好像会默认把第一个 # 认作文章标题而不会解析到目录中
        if (response.data.content_type === 'md') {
          setArticleInfo(response.data);
          setLike({
            is_liked: response.data.is_liked,
            like_num: response.data.like_num as number,
          });
          setCollect({
            is_collection: response.data.is_collection,
            collection_num: response.data.collection_num as number,
          });
          setNavBar({
            show: true,
            content: `#${response.data.title}\n${response.data.content}`,
          });
        } else if (response.data.content_type === 'rtf') {
          setArticleInfo(response.data);
        }
      },
    },
  );

  const { run: postLike } = useRequest(API.like.postLike.request, {
    manual: true,
    onSuccess: () => {
      const likeBoolean = !like.is_liked;
      const newNum = likeBoolean ? like.like_num + 1 : like.like_num - 1;
      setLike({ is_liked: likeBoolean, like_num: newNum });
    },
  });

  const { run: postCollect } = useRequest(API.collection.postByPost_id.request, {
    manual: true,
    onSuccess: () => {
      const collectBoolean = !collect.is_collection;
      const newNum = collectBoolean
        ? collect.collection_num + 1
        : collect.collection_num - 1;
      setCollect({ is_collection: collectBoolean, collection_num: newNum });
    },
  });

  const [like, setLike] = useState({ is_liked, like_num: like_num as number });
  const [collect, setCollect] = useState({
    is_collection,
    collection_num: collection_num as number,
  });

  const handleToComment = () => {
    window.scrollTo({
      top: ref.current?.getBoundingClientRect().top,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <ActionWrapper offsetTop={200}>
        <Badge
          offset={[-5, 5]}
          count={like.like_num}
          color={like.is_liked ? 'gold' : `#8a919f`}
          showZero
        >
          <Action
            onClick={() => {
              postLike({}, { target_id: +(article_id as string), type_name: 'post' });
            }}
            done={like.is_liked}
          >
            <LikeFilled />
          </Action>
        </Badge>
      </ActionWrapper>
      <ActionWrapper offsetTop={265}>
        <Badge
          offset={[-5, 5]}
          count={collect.collection_num}
          color={collect.is_collection ? 'gold' : `#8a919f`}
          showZero
        >
          <Action
            onClick={() => {
              postCollect({ post_id: +(article_id as string) }, {});
            }}
            done={collect.is_collection}
          >
            <StarFilled />
          </Action>
        </Badge>
      </ActionWrapper>
      <ActionWrapper offsetTop={330}>
        <Badge offset={[-5, 5]} count={comment_num} color="#8a919f" showZero>
          <Action onClick={handleToComment}>
            <MessageFilled />
          </Action>
        </Badge>
      </ActionWrapper>
      <ActionWrapper offsetTop={395}>
        <Action>
          <ShareAltOutlined />
        </Action>
      </ActionWrapper>
      <ActionWrapper offsetTop={460}>
        <Action>举报</Action>
      </ActionWrapper>
      {/**以后还可以做沉浸阅读等功能 */}
      {loading ? (
        <Loading />
      ) : (
        <>
          <style.Wrapper>
            <ArticleCard>
              <style.ArticleBody>
                <h1>{articleInfo.title}</h1>
                <style.CreatorInfo>
                  <Avatar
                    height={'3em'}
                    width={'3em'}
                    src={creator_avatar}
                    userId={creator_id}
                  />
                  <div className="info">
                    <style.Name>{creator_name}</style.Name>
                    <style.Time>
                      {moment(time).format('YYYY年MM月DD日 HH:MM:ss')}
                    </style.Time>
                  </div>
                </style.CreatorInfo>
                <div
                  id="markdown-body"
                  dangerouslySetInnerHTML={{
                    __html: (content_type === 'md'
                      ? compiled_content
                      : content) as string,
                  }}
                ></div>
                <style.ArticleInfo>
                  分类:<ArticleCategory>{category as string}</ArticleCategory>
                  标签: <Tag tag={(tags as string[])[0]}></Tag>
                </style.ArticleInfo>
              </style.ArticleBody>
            </ArticleCard>
            <Card>
              <Comment
                ref={ref}
                commentList={sub_posts ? sub_posts : []}
                post_id={+(article_id as string)}
              />
            </Card>
          </style.Wrapper>
        </>
      )}

      <BackToTop />
    </>
  );
};

export default Article;

{
  /* {navBar.show ? (
              <Navigation>
                <MarkdownNavbar ordered={false} source={navBar.content} />
              </Navigation>
            ) : null} */
}

{
  /* <style.Back>
                <div>
                  <LikeFilled
                    style={{ color: isLike ? 'rgb(254 0 0 / 88%)' : '' }}
                    onClick={handleLike}
                  />
                </div>
                <div>
                  <HeartFilled
                    style={{ color: isC ? 'rgb(254 0 0 / 88%)' : '' }}
                    onClick={handleCollect}
                  />
                </div>
              </style.Back> */
}
