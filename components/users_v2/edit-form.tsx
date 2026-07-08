'use client';

import React, { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateUsersV2Action, ActionState } from '@/app/lib/actions/users_v2-actions';
import { UsersV2 } from '@/app/lib/types/UsersV2';

export function EditUsersV2Form({ record, onSuccess }: { record: UsersV2; onSuccess?: () => void }) {
  const updateWithKeys = updateUsersV2Action.bind(null, record.id);

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (prevState, formData) => {
      const res = await updateWithKeys(prevState, formData);
      if (res.success && onSuccess) {
        onSuccess();
      }
      return res;
    },
    { message: null }
  );

  return (
    <form action={formAction} className="space-y-4 pt-4">
      {state?.message && !state.success && (
        <div className="p-3 bg-destructive/15 text-destructive rounded-md text-sm">{state.message}</div>
      )}
      
        <div className="space-y-2">
          <Label htmlFor="name">NAME</Label>
          <Input 
            id="name" 
            name="name" 
            type="text" 
            defaultValue={record.name !== undefined ? String(record.name) : ''} 
          />
          {state?.errors?.name && (
            <p className="text-xs text-destructive">{state.errors.name[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">EMAIL</Label>
          <Input 
            id="email" 
            name="email" 
            type="text" 
            defaultValue={record.email !== undefined ? String(record.email) : ''} 
          />
          {state?.errors?.email && (
            <p className="text-xs text-destructive">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">IMAGE</Label>
          <Input 
            id="image" 
            name="image" 
            type="text" 
            defaultValue={record.image !== undefined ? String(record.image) : ''} 
          />
          {state?.errors?.image && (
            <p className="text-xs text-destructive">{state.errors.image[0]}</p>
          )}
        </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving Changes...' : 'Save Changes'}
      </Button>
    </form>
  );
}
