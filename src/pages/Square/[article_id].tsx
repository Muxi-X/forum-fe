import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import MarkdownNavbar from 'markdown-navbar';
import styled from 'styled-components';
import { Sitdown } from 'sitdown';
import MarkdownService from 'markdown-it';
import { searchDraft } from 'db/db';
import 'markdown-navbar/dist/navbar.css';
import 'assets/theme/theme.less';

const ArticleBody = styled.article`
  display: flex;
`;

const Article: React.FC = () => {
  const [content, setContent] = useState('');
  const [navBar, setNavBar] = useState('');

  const { article_id } = useParams();
  useEffect(() => {
    searchDraft(article_id as string).then((d) => {
      // 目录生成逻辑 如果是markdown 就用markdown源码进行 而如果是富文本的话则用Turndown逆解析后再使用
      // 这里都要加上title的话是因为这个Navbar组件好像会默认把第一个 # 认作文章标题而不会解析道目录中
      if (d?.type === 'md') {
        const md = new MarkdownService();
        setContent(md.render(d.content));
        setNavBar(`#${d.title}\n${d.content}`);
      } else {
        setContent(d?.content as string);
        const sitdown = new Sitdown();
        const md = sitdown.HTMLToMD(`<h1>${d?.title}</h1>${d?.content}`);
        setNavBar(md);
      }
    });
  }, []);

  return (
    <ArticleBody>
      <div id="markdown-body" dangerouslySetInnerHTML={{ __html: content }}></div>
      <div className="navigation">
        <MarkdownNavbar source={navBar} />
      </div>
    </ArticleBody>
  );
};

export default Article;
