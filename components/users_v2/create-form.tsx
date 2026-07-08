'use client';

import React, { useActionState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@/components/ui/dialog'; // Import DialogClose to close internally
import { createUsersV2Action, ActionState } from '@/app/lib/actions/users_v2-actions';

export function CreateUsersV2Form() {
  const closeRef = useRef<HTMLButtonElement>(null);

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (prevState, formData) => {
      const res = await createUsersV2Action(prevState, formData);
      // If server action succeeded, programmatically click the hidden DialogClose button
      if (res.success) {
        closeRef.current?.click();
      }
      return res;
    },
    { message: null }
  );

  return (
    <form action={formAction} className="space-y-4 pt-4" encType="multipart/form-data">
      {/* Hidden Radix-UI Close controller */}
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

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : 'Create UsersV2'}
      </Button>
    </form>
  );
}
