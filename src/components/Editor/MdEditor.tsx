import React from 'react';
import Editor from 'md-editor-rt';
import qiniupload, { observer, CompleteRes } from 'utils/qiniup';
import { QiniuServer } from 'config';
import DOMPurify from 'dompurify';
import 'md-editor-rt/lib/style.css';
import { EditorProps } from './type';

interface MdEditorProps extends EditorProps {
  onHtmlChanged: (html: string) => void;
}

const MdEditor: React.FC<MdEditorProps> = ({
  editorContent,
  handleEditorContent,
  onHtmlChanged,
  token,
}) => {
  // 上传图片
  const onUploadImg = (files: Array<File>, callback: (urls: string[]) => void) => {
    const file = files[files.length - 1];
    observer.complete = (res: CompleteRes) => {
      let resArr = [res];
      callback(resArr.map((res) => QiniuServer + res.key));
    };
    qiniupload(file, token);
  };
  return (
    <>
      <Editor
        style={{ height: '100%' }}
        modelValue={editorContent}
        onChange={handleEditorContent}
        placeholder="请输入您想输入的内容"
        showCodeRowNumber={true}
        previewTheme={'vuepress'}
        onUploadImg={onUploadImg}
        onHtmlChanged={onHtmlChanged}
        sanitize={(html) => DOMPurify.sanitize(html)}
      />
    </>
  );
};

export default MdEditor;
