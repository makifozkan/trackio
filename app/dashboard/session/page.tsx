import React from 'react';
import { fetchAllSessions } from '@/app/lib/db-handlers/session-handlers';
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
import { CreateSessionForm } from '@/components/session/create-form';
import { EditSessionForm } from '@/components/session/edit-form';
import DeleteSessionButton from '@/components/session/delete-dialog';

export default async function SessionPage() {
  const records = await fetchAllSessions();

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Manage Session</CardTitle>
          
          {/* Uncontrolled Create Dialog - Closes internally via <DialogClose> */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Create New</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Session Record</DialogTitle>
              </DialogHeader>
              <CreateSessionForm />
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>USER ID</TableHead>
                <TableHead>SESSION TOKEN</TableHead>
                <TableHead>EXPIRES</TableHead>
                <TableHead>USER V2 ID</TableHead>
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
                  <TableCell>{String(item.user_id)}</TableCell>
                  <TableCell>{String(item.session_token)}</TableCell>
                  <TableCell>{String(item.expires)}</TableCell>
                  <TableCell>{String(item.user_v2_id)}</TableCell>
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
                              <DialogTitle>Edit Session Record</DialogTitle>
                            </DialogHeader>
                            <EditSessionForm record={item} />
                          </DialogContent>
                        </Dialog>

                        <DeleteSessionButton id={item.id} />
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
