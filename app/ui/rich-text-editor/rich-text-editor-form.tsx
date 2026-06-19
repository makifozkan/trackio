'use client';

import { FunctionComponent, useActionState, useState } from "react";
import RichTextEditor from "./rich-text-editor";
import { Button } from "@/components/ui/button";
import { State } from "@/app/lib/actions";
import { ExplorerFormState, saveTaskExploration } from "@/app/lib/explorer-actions";

interface RichTextEditorFormProps {

}

const RichTextEditorForm: FunctionComponent<RichTextEditorFormProps> = () => {
    const initialState: ExplorerFormState = { message: null, errors: {} };
    const [state, formAction] = useActionState(saveTaskExploration, initialState);
    const [editorContent, setEditorContent] = useState('');


    return (<>
        <RichTextEditor onChange={(content) => setEditorContent(content)} />
        <form action={formAction}>
            <input defaultValue={editorContent} type='text' hidden />
            <div className='flex justify-end mt-4 gap-4'>
                <Button variant="outline">Clear</Button>
                <Button type="submit">Save Changes</Button>
            </div>
        </form >

    </>);
}

export default RichTextEditorForm;