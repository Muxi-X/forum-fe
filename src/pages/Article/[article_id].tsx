import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import MarkdownNavbar from 'markdown-navbar';
import styled from 'styled-components';
import { Sitdown } from 'sitdown';
import MarkdownService from 'markdown-it';
import { searchDraft } from 'utils/db_drafts';
import Comment from './components/comment';
import Card from 'components/Card/card';
import 'markdown-navbar/dist/navbar.css';
import 'assets/theme/theme.less';
import Avatar from 'components/Avatar/avatar';
import { LikeFilled, HeartFilled } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import useProfile from 'store/useProfile';

const ArticleBody = styled.article``;

const Wrapper = styled.div`
  margin-top: 5vh;
`;

const Back = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  font-size: 2em;

  div {
    cursor: pointer;
  }
`;

const Article: React.FC = () => {
  const [content, setContent] = useState('');
  const [navBar, setNavBar] = useState('');
  const [title, setTitle] = useState('');
  const { article_id } = useParams();
  const { userProfile } = useProfile();

  const { data } = useRequest(
    () =>
      API.post.getPostByPost_id.request({
        post_id: +(article_id as string),
      }),
    {
      onSuccess: (response) => {
        // 目录生成逻辑 如果是markdown 就用markdown源码进行 而如果是富文本的话则用Turndown逆解析后再使用
        // 这里都要加上title的话是因为这个Navbar组件好像会默认把第一个 # 认作文章标题而不会解析到目录中
        if (response.data.content_type === 'md') {
          const md = new MarkdownService();
          setContent(md.render(response.data.content as string));
          setNavBar(`#${response.data.title}\n${response.data.content}`);
        } else if (response.data.content_type === 'rtf') {
          setContent(response.data?.content as string);
          const sitdown = new Sitdown();
          const md = sitdown.HTMLToMD(
            `<h1>${data?.data?.title}</h1>${data?.data?.content}`,
          );
          console.log(md);
          setNavBar(md);
        }
      },
    },
  );

  const [isLike, setIsLike] = useState(false);
  const [isC, setIsC] = useState(false);

  const handleLike = () => {
    setIsLike(true);
  };

  const handleCollect = () => {
    setIsC(true);
    const id = localStorage.getItem('id');
    // Service.addC(id, article_id).then((res: any) => {
    //   console.log(res);
    // });
  };
  return (
    <Wrapper>
      <Card>
        <ArticleBody>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={userProfile.avatar} size="mid" />
            <h3 style={{ marginLeft: '2em' }}> {userProfile.name}</h3>
          </div>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <h2>{title}</h2>
          </div>
          <div id="markdown-body" dangerouslySetInnerHTML={{ __html: content }}></div>
          <div className="navigation">
            <MarkdownNavbar source={navBar} />
          </div>
          <Back>
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
          </Back>
        </ArticleBody>
      </Card>
      <br />
      <Card>
        <Comment avatarUrl={userProfile.avatar as string} />
      </Card>
    </Wrapper>
  );
};

export default Article;
