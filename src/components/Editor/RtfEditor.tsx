import '@wangeditor/editor/dist/css/style.css'; // 引入 css

import React, { useState, useEffect } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig } from '@wangeditor/editor';
import { EditorProps } from './type';

const RtfEditor: React.FC<EditorProps> = ({ editorContent, handleEditorContent }) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null); // 存储 editor 实例
  const toolbarConfig = {};
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100, height: '100%' }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={editorContent}
          onCreated={setEditor}
          onChange={handleEditorContent}
          mode="default"
          style={{ height: '100%', overflowY: 'hidden' }}
        />
      </div>
    </>
  );
};

export default RtfEditor;
