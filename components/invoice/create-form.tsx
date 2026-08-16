'use client';

import React, { useActionState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@/components/ui/dialog';
import { createInvoiceAction, ActionState } from '@/app/lib/actions/invoice-actions';

export function CreateInvoiceForm() {
  const closeRef = useRef<HTMLButtonElement>(null);

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (prevState, formData) => {
      try {
        // Safe execution try/catch
        const res = await createInvoiceAction(prevState, formData);
        if (res.success) {
          closeRef.current?.click();
        }
        return res;
      } catch (error) {
        console.error('Client Network Error Caught:', error);

        // Return a clean, user-friendly 500 error mapping instead of crashing
        return {
          success: false,
          message:
            'Server Error: The uploaded file may exceed the permitted payload size limit, or a database timeout occurred.',
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
        <Input id="customer_id" name="customer_id" type="number" placeholder="Enter number" />
        {state?.errors?.customer_id && (
          <p className="text-xs text-destructive">{state.errors.customer_id[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">AMOUNT</Label>
        <Input id="amount" name="amount" type="number" placeholder="Enter number" />
        {state?.errors?.amount && (
          <p className="text-xs text-destructive">{state.errors.amount[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">STATUS</Label>
        <Input id="status" name="status" type="text" placeholder="Enter status" />
        {state?.errors?.status && (
          <p className="text-xs text-destructive">{state.errors.status[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_date">DUE DATE</Label>
        <Input id="due_date" name="due_date" type="text" placeholder="Enter due_date" />
        {state?.errors?.due_date && (
          <p className="text-xs text-destructive">{state.errors.due_date[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="user_v2_id">USER V2 ID</Label>
        <Input id="user_v2_id" name="user_v2_id" type="text" placeholder="Enter user_v2_id" />
        {state?.errors?.user_v2_id && (
          <p className="text-xs text-destructive">{state.errors.user_v2_id[0]}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : 'Create Invoice'}
      </Button>
    </form>
  );
}
