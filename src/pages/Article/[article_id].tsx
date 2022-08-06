import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import MarkdownNavbar from 'markdown-navbar';
import styled from 'styled-components';
import { Sitdown } from 'sitdown';
import MarkdownService from 'markdown-it';
import { searchDraft } from 'utils/db_drafts';
import Service from 'service/fetch';
import Comment from './components/comment';
import Card from 'components/Card/card';
import 'markdown-navbar/dist/navbar.css';
import 'assets/theme/theme.less';
import Avatar from 'components/Avatar/avatar';
import { LikeFilled, HeartFilled } from '@ant-design/icons';

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
  const [user, setUser] = useState<any>({});
  const { article_id } = useParams();
  useEffect(() => {
    // searchDraft(article_id as string).then((d) => {
    //   // 目录生成逻辑 如果是markdown 就用markdown源码进行 而如果是富文本的话则用Turndown逆解析后再使用
    //   // 这里都要加上title的话是因为这个Navbar组件好像会默认把第一个 # 认作文章标题而不会解析道目录中
    //   if (d?.type === 'md') {
    //     const md = new MarkdownService();
    //     setContent(md.render(d.content));
    //     setNavBar(`#${d.title}\n${d.content}`);
    //   } else {
    //     setContent(d?.content as string);
    //     const sitdown = new Sitdown();
    //     const md = sitdown.HTMLToMD(`<h1>${d?.title}</h1>${d?.content}`);
    //     setNavBar(md);
    //   }
    // });
    Service.getArtById(+(article_id as string)).then((res: any) => {
      const md = new MarkdownService();
      setNavBar(`#${res.title}\n${res.content}`);
      setContent(md.render(res.data.content));
      setTitle(res.data.title);
      Service.getUser(res.data.uid).then((res: any) => {
        setUser(res.data);
      });
    });
  }, []);

  const [isLike, setIsLike] = useState(false);
  const [isC, setIsC] = useState(false);

  const handleLike = () => {
    setIsLike(true);
  };

  const handleCollect = () => {
    setIsC(true);
    const id = localStorage.getItem('id');
    Service.addC(id, article_id).then((res: any) => {
      console.log(res);
    });
  };
  return (
    <Wrapper>
      <Card>
        <ArticleBody>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={user.profilePhoto} size="mid" />
            <h3 style={{ marginLeft: '2em' }}> {user.userName}</h3>
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
        <Comment avatarUrl={user.profilePhoto} />
      </Card>
    </Wrapper>
  );
};

export default Article;
