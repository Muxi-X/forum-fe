import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import MarkdownNavbar from 'markdown-navbar';
import styled from 'styled-components';
import { searchDraft } from 'db/db';
import 'markdown-navbar/dist/navbar.css';
import 'assets/theme/theme.less';

const ArticleBody = styled.article`
  display: flex;
`;

const Article: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [str, setStr] = useState('');

  const { article_id } = useParams();
  useEffect(() => {
    setContent(localStorage.getItem(article_id as string) as string);
    searchDraft('new__1653535165185').then((d) => {
      setStr(d?.content as string);
    });
  }, []);

  return (
    <ArticleBody>
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: content }}></div>
      <div className="navigation">
        <MarkdownNavbar source={str} />
      </div>
    </ArticleBody>
  );
};

export default Article;
