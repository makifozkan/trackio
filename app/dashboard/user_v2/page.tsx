import React from 'react';
import { fetchAllUserV2s } from '@/app/lib/db-handlers/user_v2-handlers';
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
import { CreateUserV2Form } from '@/components/user_v2/create-form';
import { EditUserV2Form } from '@/components/user_v2/edit-form';
import DeleteUserV2Button from '@/components/user_v2/delete-dialog';

export default async function UserV2Page() {
  const records = await fetchAllUserV2s();

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Manage UserV2</CardTitle>

          {/* Uncontrolled Create Dialog - Closes internally via <DialogClose> */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Create New</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add UserV2 Record</DialogTitle>
              </DialogHeader>
              <CreateUserV2Form />
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>NAME</TableHead>
                <TableHead>EMAIL</TableHead>
                <TableHead>IMAGE</TableHead>
                <TableHead>CREATED AT</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No records found in table.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((item: any, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{String(item.id)}</TableCell>
                    <TableCell>{String(item.name)}</TableCell>
                    <TableCell>{String(item.email)}</TableCell>
                    <TableCell>
                      {item.image ? (
                        <img
                          src={String(item.image)}
                          alt="Thumbnail"
                          className="h-10 w-10 object-cover rounded border"
                        />
                      ) : (
                        <span className="text-muted-foreground text-xs">No image</span>
                      )}
                    </TableCell>
                    <TableCell>{String(item.created_at)}</TableCell>
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
                              <DialogTitle>Edit UserV2 Record</DialogTitle>
                            </DialogHeader>
                            <EditUserV2Form record={item} />
                          </DialogContent>
                        </Dialog>

                        <DeleteUserV2Button id={item.id} />
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
