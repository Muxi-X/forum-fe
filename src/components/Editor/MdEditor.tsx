import React from 'react';
import Editor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { EditorProps } from './type';

const MdEditor: React.FC<EditorProps> = ({ editorContent, handleEditorContent }) => {
  return (
    <>
      <Editor
        style={{ height: '100%' }}
        modelValue={editorContent}
        onChange={handleEditorContent}
        placeholder="请输入您想输入的内容"
        showCodeRowNumber={true}
        previewTheme={'vuepress'}
      />
    </>
  );
};

export default MdEditor;
