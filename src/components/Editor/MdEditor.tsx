import React, { useState } from 'react';
import Editor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default function MdEditor() {
  const [text, setText] = useState('');
  return <Editor modelValue={text} onChange={setText} />;
}
