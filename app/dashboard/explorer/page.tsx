import MenuBar from '@/app/ui/rich-text-editor/menu-bar';
import RichTextEditor from '@/app/ui/rich-text-editor/rich-text-editor';
import RichTextEditorForm from '@/app/ui/rich-text-editor/rich-text-editor-form';
import { Button } from '@/components/ui/button';

export default function Page() {
  return (
    <div className="flex flex-col flex-1 h-full">
      Explorer Page
      <RichTextEditorForm />
    </div>
  );
}
