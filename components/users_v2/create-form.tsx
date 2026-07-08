'use client';

import React, { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createUsersV2Action, ActionState } from '@/app/lib/actions/users_v2-actions';

export function CreateUsersV2Form({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (prevState, formData) => {
      const res = await createUsersV2Action(prevState, formData);
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
          <Input id="image" name="image" type="text" placeholder="Enter image" />
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
