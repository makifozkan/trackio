'use client';

import React, { useActionState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@/components/ui/dialog';
import { createUsersAction, ActionState } from '@/app/lib/actions/users-actions';

export function CreateUsersForm() {
  const closeRef = useRef<HTMLButtonElement>(null);

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (prevState, formData) => {
      try {
        // Safe execution try/catch
        const res = await createUsersAction(prevState, formData);
        if (res.success) {
          closeRef.current?.click();
        }
        return res;
      } catch (error) {
        console.error('Client Network Error Caught:', error);
        
        // Return a clean, user-friendly 500 error mapping instead of crashing
        return {
          success: false,
          message: 'Server Error: The uploaded file may exceed the permitted payload size limit, or a database timeout occurred.',
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
          <Input id="name" name="name" type="text" placeholder="Enter name" />
          {state?.errors?.name && (
            <p className="text-xs text-destructive">{state.errors.name[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">EMAIL</Label>
          <Input id="email" name="email" type="text" placeholder="Enter email" />
          {state?.errors?.email && (
            <p className="text-xs text-destructive">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">IMAGE</Label>
          <Input id="image" name="image" type="file" accept="image/*" />
          {state?.errors?.image && (
            <p className="text-xs text-destructive">{state.errors.image[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="created_at">CREATED AT</Label>
          <Input id="created_at" name="created_at" type="text" placeholder="Enter created_at" />
          {state?.errors?.created_at && (
            <p className="text-xs text-destructive">{state.errors.created_at[0]}</p>
          )}
        </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : 'Create Users'}
      </Button>
    </form>
  );
}
