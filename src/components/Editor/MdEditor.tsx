import React from 'react';
import Editor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { EditorProps } from './type';

const MdEditor: React.FC<EditorProps> = ({ editorContent, handleEditorContent }) => {
  const onUploadImg = async (file: any, callback: any) => {
    const form = new FormData();
    form.append('photo', file[0]);
    // const res = await Service.upload(form).then((res: any) => {
    //   return res;
    // });
    // let resArr = [res];
    // callback(resArr.map((res) => 'http://192.168.148.152:8080' + res.data));
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
      />
    </>
  );
};

export default MdEditor;
