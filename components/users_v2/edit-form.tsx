'use client';

import React, { useActionState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@/components/ui/dialog';
import { updateUsersV2Action, ActionState } from '@/app/lib/actions/users_v2-actions';
import { UsersV2 } from '@/app/lib/types/UsersV2';

export function EditUsersV2Form({ record }: { record: UsersV2 }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const updateWithKeys = updateUsersV2Action.bind(null, record.id);

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
          message: 'Server Error: The uploaded file may exceed the permitted payload size limit, or modifications could not be processed.',
        };
      }
    },
    { message: null }
  );

  return (
    <form action={formAction} className="space-y-4 pt-4">
      <DialogClose ref={closeRef} className="hidden" />

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
          {record.image && (
            <div className="mb-2">
              <img src={String(record.image)} alt="Preview" className="h-16 w-16 object-cover rounded-md border" />
            </div>
          )}
          <Input id="image" name="image" type="file" accept="image/*" />
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
