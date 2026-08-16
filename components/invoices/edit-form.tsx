'use client';

import React, { useActionState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@/components/ui/dialog';
import { updateInvoicesAction, ActionState } from '@/app/lib/actions/invoices-actions';
import { Invoices } from '@/app/lib/types/Invoices';

export function EditInvoicesForm({ record }: { record: Invoices }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const updateWithKeys = updateInvoicesAction.bind(null, record.id);

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
        <Label htmlFor="customer_id">CUSTOMER ID</Label>
        <Input
          id="customer_id"
          name="customer_id"
          type="number"
          defaultValue={record.customer_id !== undefined ? String(record.customer_id) : ''}
        />
        {state?.errors?.customer_id && (
          <p className="text-xs text-destructive">{state.errors.customer_id[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">AMOUNT</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          defaultValue={record.amount !== undefined ? String(record.amount) : ''}
        />
        {state?.errors?.amount && (
          <p className="text-xs text-destructive">{state.errors.amount[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">STATUS</Label>
        <Input
          id="status"
          name="status"
          type="text"
          defaultValue={record.status !== undefined ? String(record.status) : ''}
        />
        {state?.errors?.status && (
          <p className="text-xs text-destructive">{state.errors.status[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_date">DUE DATE</Label>
        <Input
          id="due_date"
          name="due_date"
          type="text"
          defaultValue={record.due_date !== undefined ? String(record.due_date) : ''}
        />
        {state?.errors?.due_date && (
          <p className="text-xs text-destructive">{state.errors.due_date[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="users_v2_id">USERS V2 ID</Label>
        <Input
          id="users_v2_id"
          name="users_v2_id"
          type="text"
          defaultValue={record.users_v2_id !== undefined ? String(record.users_v2_id) : ''}
        />
        {state?.errors?.users_v2_id && (
          <p className="text-xs text-destructive">{state.errors.users_v2_id[0]}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving Changes...' : 'Save Changes'}
      </Button>
    </form>
  );
}
