import React, { useState, useEffect } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig } from '@wangeditor/editor';
import { nanoid } from 'nanoid';
import { QiniuServer } from 'config';
import { EditorProps } from './type';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css

const RtfEditor: React.FC<EditorProps> = ({
  editorContent,
  handleEditorContent,
  token,
}) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null); // 存储 editor 实例

  const toolbarConfig = {};
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    MENU_CONF: {},
  };

  (editorConfig.MENU_CONF as any)['uploadImage'] = {
    server: 'http://upload-z2.qiniup.com',
    customInsert(res: any, insertFn: any) {
      // 从 res 中找到 url alt href ，然后插入图片
      insertFn(`${QiniuServer}${res.key}`);
    },
    timeout: 5 * 1000, // 5s

    fieldName: 'file',
    meta: { token: token, key: nanoid() },

    maxFileSize: 10 * 1024 * 1024, // 10M

    base64LimitSize: 5 * 1024, // insert base64 format, if file's size less than 5kb
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
