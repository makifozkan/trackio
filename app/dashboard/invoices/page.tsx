import React from 'react';
import { fetchAllInvoicess } from '@/app/lib/db-handlers/invoices-handlers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateInvoicesForm } from '@/components/invoices/create-form';
import { EditInvoicesForm } from '@/components/invoices/edit-form';
import DeleteInvoicesButton from '@/components/invoices/delete-dialog';

export default async function InvoicesPage() {
  const records = await fetchAllInvoicess();

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Manage Invoices</CardTitle>

          {/* Uncontrolled Create Dialog - Closes internally via <DialogClose> */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Create New</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Invoices Record</DialogTitle>
              </DialogHeader>
              <CreateInvoicesForm />
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>CUSTOMER ID</TableHead>
                <TableHead>AMOUNT</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>DUE DATE</TableHead>
                <TableHead>USERS V2 ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No records found in table.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((item: any, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{String(item.id)}</TableCell>
                    <TableCell>{String(item.customer_id)}</TableCell>
                    <TableCell>{String(item.amount)}</TableCell>
                    <TableCell>{String(item.status)}</TableCell>
                    <TableCell>{String(item.due_date)}</TableCell>
                    <TableCell>{String(item.users_v2_id)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 items-center">
                        {/* Uncontrolled Edit Dialog - Closes internally via <DialogClose> */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Invoices Record</DialogTitle>
                            </DialogHeader>
                            <EditInvoicesForm record={item} />
                          </DialogContent>
                        </Dialog>

                        <DeleteInvoicesButton id={item.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
