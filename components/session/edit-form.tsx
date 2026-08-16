'use client';

import React, { useActionState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@/components/ui/dialog';
import { updateSessionAction, ActionState } from '@/app/lib/actions/session-actions';
import { Session } from '@/app/lib/types/Session';

export function EditSessionForm({ record }: { record: Session }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const updateWithKeys = updateSessionAction.bind(null, record.id);

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (prevState, formData) => {
      try {
        const res = await updateWithKeys(prevState, formData);
        if (res.success) {
          closeRef.current?.click();
        }
        return res;
      } catch (error) {
        console.error('Client Network Error Caught:', error);
        return {
          success: false,
          message:
            'Server Error: The uploaded file may exceed the permitted payload size limit, or modifications could not be processed.',
        };
      }
    },
    { message: null }
  );

  return (
    <form action={formAction} className="space-y-4 pt-4">
      <DialogClose ref={closeRef} className="hidden" />

      {state?.message && !state.success && (
        <div className="p-3 bg-destructive/15 text-destructive rounded-md text-sm">
          {state.message}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="user_id">USER ID</Label>
        <Input
          id="user_id"
          name="user_id"
          type="text"
          defaultValue={record.user_id !== undefined ? String(record.user_id) : ''}
        />
        {state?.errors?.user_id && (
          <p className="text-xs text-destructive">{state.errors.user_id[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="session_token">SESSION TOKEN</Label>
        <Input
          id="session_token"
          name="session_token"
          type="text"
          defaultValue={record.session_token !== undefined ? String(record.session_token) : ''}
        />
        {state?.errors?.session_token && (
          <p className="text-xs text-destructive">{state.errors.session_token[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="expires">EXPIRES</Label>
        <Input
          id="expires"
          name="expires"
          type="text"
          defaultValue={record.expires !== undefined ? String(record.expires) : ''}
        />
        {state?.errors?.expires && (
          <p className="text-xs text-destructive">{state.errors.expires[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="user_v2_id">USER V2 ID</Label>
        <Input
          id="user_v2_id"
          name="user_v2_id"
          type="text"
          defaultValue={record.user_v2_id !== undefined ? String(record.user_v2_id) : ''}
        />
        {state?.errors?.user_v2_id && (
          <p className="text-xs text-destructive">{state.errors.user_v2_id[0]}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving Changes...' : 'Save Changes'}
      </Button>
    </form>
  );
}
