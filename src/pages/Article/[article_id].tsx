import React, { useEffect, useRef, useState } from 'react';
import moment from 'utils/moment';
import { useParams } from 'react-router';
import MarkdownNavbar from 'markdown-navbar';
import {
  LikeFilled,
  StarFilled,
  MessageFilled,
  createFromIconfontCN,
} from '@ant-design/icons';
import { Card, Affix, Badge, message, Modal, Input } from 'antd';
import { useNavigate } from 'react-router';
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
import useDocTitle from 'hooks/useDocTitle';
import { CATEGORY, CATEGORY_EN } from 'config';

interface ActionProps {
  done?: boolean;
}

const { Category } = Tag;
const { TextArea } = Input;

const ArticleCategory = styled(Category)`
  margin: 10px;
  margin-right: 4em;
`;

const ActionWrapper = styled(Affix)`
  position: absolute;
  left: -10%;
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

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_3699573_vczcgw5jf6p.js',
});

const Icon: React.FC<{ onClick?: () => void; type: string }> = ({ type, onClick }) => {
  const [hover, setHover] = useState(false);

  return (
    <Action
      onClick={() => {
        if (type.includes('share')) {
          navigator.clipboard.writeText(location.href);
          message.success('文章链接已复制到剪切板上!');
        } else {
          onClick && onClick();
        }
      }}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      <IconFont type={hover ? type + '_hover' : type}></IconFont>
    </Action>
  );
};

const Article: React.FC = () => {
  const [articleInfo, setArticleInfo] = useState<defs.post_GetPostResponse>({});
  const [navBar, setNavBar] = useState({ show: false, content: '' });
  const [showReport, setShowReport] = useState(false);
  const [reportVal, setReportVal] = useState('');
  const ref = useRef<HTMLDivElement>();
  const { article_id } = useParams();
  const nav = useNavigate();

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
          setNavBar({
            show: true,
            content: `#${response.data.title}\n${response.data.content}`,
          });
        } else if (response.data.content_type === 'rtf') {
          setArticleInfo(response.data);
        }
        useDocTitle(`${response.data.title} - 论坛`);
        setArticleInfo(response.data);
        setLike({
          is_liked: response.data.is_liked,
          like_num: response.data.like_num as number,
        });
        setCollect({
          is_collection: response.data.is_collection,
          collection_num: response.data.collection_num as number,
        });
        setCommentNum(response.data.comment_num as number);
      },
    },
  );

  const { run: report } = useRequest(API.report.postReport.request, {
    manual: true,
    onSuccess: () => {
      setShowReport(false);
      message.success('举报成功!');
    },
  });

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

  const [commentNum, setCommentNum] = useState<number>(0);

  const handleToComment = () => {
    window.scrollTo({
      top: ref.current?.getBoundingClientRect().top,
      behavior: 'smooth',
    });
  };

  const handleReport = () => {
    report({}, { cause: reportVal, post_id: +(article_id as string), type_name: 'post' });
  };

  const handleAddComment = (num: number) => {
    setCommentNum(num);
  };
  return (
    <>
      {/**以后还可以做沉浸阅读等功能 */}
      {loading ? (
        <Loading />
      ) : (
        <style.Wrapper>
          <ActionWrapper offsetTop={200}>
            <Badge
              offset={[-5, 5]}
              count={like.like_num}
              color={like.is_liked ? 'gold' : `#8a919f`}
              showZero
              overflowCount={9999}
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
              overflowCount={9999}
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
            <Badge
              offset={[-5, 5]}
              count={commentNum}
              color="#8a919f"
              showZero
              overflowCount={9999}
            >
              <Action onClick={handleToComment}>
                <MessageFilled />
              </Action>
            </Badge>
          </ActionWrapper>
          <ActionWrapper offsetTop={395}>
            <Icon type="icon-share" />
          </ActionWrapper>
          <ActionWrapper offsetTop={460}>
            <Icon
              onClick={() => {
                setShowReport(true);
              }}
              type="icon-report"
            />
          </ActionWrapper>
          <style.ArticleCard>
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
                  __html: (content_type === 'md' ? compiled_content : content) as string,
                }}
              ></div>
              <style.ArticleInfo>
                分类:
                <ArticleCategory
                  onClick={() => {
                    const c = CATEGORY_EN[CATEGORY.indexOf(category as string)];
                    nav(`/${c}`);
                  }}
                >
                  {category as string}
                </ArticleCategory>
                标签: <Tag onClick={() => {}} inArticle tag={(tags as string[])[0]}></Tag>
              </style.ArticleInfo>
            </style.ArticleBody>
          </style.ArticleCard>
          <Card>
            <Comment
              ref={ref}
              commentList={sub_posts ? sub_posts : []}
              post_id={+(article_id as string)}
              commentNum={commentNum}
              handleAddComment={handleAddComment}
            />
          </Card>
        </style.Wrapper>
      )}
      <Modal
        centered
        open={showReport}
        onOk={handleReport}
        onCancel={() => {
          setShowReport(false);
        }}
        okText="确认"
        cancelText="取消"
        title="举报"
      >
        <TextArea
          value={reportVal}
          maxLength={100}
          onChange={(e) => {
            setReportVal(e.target.value);
          }}
          showCount
          placeholder="请输入举报原因，最多100字"
        />
      </Modal>
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
