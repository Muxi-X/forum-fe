import React from 'react';
import Editor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { EditorProps } from './type';

interface MdEditorProps extends EditorProps {
  handleMdToHtml: (h: string) => void;
}

const MdEditor: React.FC<MdEditorProps> = ({
  editorContent,
  handleEditorContent,
  handleMdToHtml,
}) => {
  return (
    <>
      <Editor
        style={{ height: '100%' }}
        modelValue={editorContent}
        onChange={handleEditorContent}
        onHtmlChanged={handleMdToHtml}
        placeholder="请输入您想输入的内容"
        showCodeRowNumber={true}
        previewTheme={'vuepress'}
      />
    </>
  );
};

export default MdEditor;
