import { IDomEditor } from '@wangeditor/editor';

export interface EditorProps {
  editorContent: string;
  handleEditorContent: (editor: IDomEditor | string) => void;
  token: string;
}
