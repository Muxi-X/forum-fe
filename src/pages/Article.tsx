import React from 'react';
import 'md-editor-rt/lib/style.css';
import '@wangeditor/editor/dist/css/style.css';

const Article: React.FC = () => {
  return (
    <div id="md-editor-rt-preview-wrapper" className="md-preview-wrapper">
      <div id="md-editor-rt-preview" className="md-preview vuepress-theme md-scrn">
        <div
          dangerouslySetInnerHTML={{ __html: localStorage.getItem('content') as string }}
        ></div>
      </div>
    </div>
  );
};

export default Article;
