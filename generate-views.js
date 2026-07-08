const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname, 'schema-diagram.json');

const componentsBaseDir = path.join(__dirname, 'components');
const appDashboardBaseDir = path.join(__dirname, 'app', 'dashboard');

function toPascalCase(str) {
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+(.)(\w*)/g, ($1, $2, $3) => $2.toUpperCase() + $3.toLowerCase())
    .replace(/\w/, (s) => s.toUpperCase());
}

function getHtmlInputProps(col) {
  const nameLower = col.name.toLowerCase();
  if (nameLower.includes('image') || nameLower.includes('avatar')) {
    return 'type="file" accept="image/*"';
  }
  const type = col.type.toUpperCase();
  if (
    type.includes('INT') ||
    type.includes('DECIMAL') ||
    type.includes('BIGINT') ||
    type === 'SERIAL'
  ) {
    return 'type="number" placeholder="Enter number"';
  }
  return `type="text" placeholder="Enter ${col.name}"`;
}

function generateViews() {
  if (!fs.existsSync(jsonFilePath)) {
    console.error(`❌ Error: Could not find "schema-diagram.json".`);
    return;
  }

  const rawData = fs.readFileSync(jsonFilePath, 'utf8');
  let diagramData;
  try {
    diagramData = JSON.parse(rawData);
  } catch (err) {
    console.error('❌ Error parsing schema-diagram.json:', err.message);
    return;
  }

  const { nodes } = diagramData;
  if (!nodes) return;

  const dbTableNodes = nodes.filter((node) => node.type === 'dbTable');

  if (dbTableNodes.length === 0) {
    console.log('ℹ️ No DB Table nodes found. Skipping views generation.');
    return;
  }

  dbTableNodes.forEach((node) => {
    const { tableName, columns } = node.data;
    if (!tableName || !columns) return;

    const pascalName = toPascalCase(tableName);
    const pks = columns.filter((col) => col.isPK);
    const inputCols = columns.filter(
      (col) =>
        !col.isPK &&
        !(col.defaultValue && col.defaultValue.trim() !== '') &&
        col.type.toUpperCase() !== 'SERIAL'
    );

    const hasImages = inputCols.some(
      (col) => col.name.toLowerCase().includes('image') || col.name.toLowerCase().includes('avatar')
    );

    const compDir = path.join(componentsBaseDir, tableName);
    const pageDir = path.join(appDashboardBaseDir, tableName);

    fs.mkdirSync(compDir, { recursive: true });
    fs.mkdirSync(pageDir, { recursive: true });

    // ==========================================
    // 1. GENERATE CREATE-FORM.TSX (Self-Closing)
    // ==========================================
    const createFormFields = inputCols
      .map((col) => {
        const isFile =
          col.name.toLowerCase().includes('image') || col.name.toLowerCase().includes('avatar');
        const inputLine = isFile
          ? `<Input id="${col.name}" name="${col.name}" type="file" accept="image/*" />`
          : `<Input id="${col.name}" name="${col.name}" ${getHtmlInputProps(col)} />`;

        return `        <div className="space-y-2">
          <Label htmlFor="${col.name}">${col.name.replace(/_/g, ' ').toUpperCase()}</Label>
          ${inputLine}
          {state?.errors?.${col.name} && (
            <p className="text-xs text-destructive">{state.errors.${col.name}[0]}</p>
          )}
        </div>`;
      })
      .join('\n\n');

    const createFormContent = `'use client';

import React, { useActionState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@/components/ui/dialog';
import { create${pascalName}Action, ActionState } from '@/app/lib/actions/${tableName}-actions';

export function Create${pascalName}Form() {
  const closeRef = useRef<HTMLButtonElement>(null);

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (prevState, formData) => {
      try {
        // Safe execution try/catch
        const res = await create${pascalName}Action(prevState, formData);
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
      
${createFormFields}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : 'Create ${pascalName}'}
      </Button>
    </form>
  );
}
`;

    // ==========================================
    // 2. GENERATE EDIT-FORM.TSX (Self-Closing)
    // ==========================================
    const editFormFields = inputCols
      .map((col) => {
        const isFile =
          col.name.toLowerCase().includes('image') || col.name.toLowerCase().includes('avatar');

        if (isFile) {
          return `        <div className="space-y-2">
          <Label htmlFor="${col.name}">${col.name.replace(/_/g, ' ').toUpperCase()}</Label>
          {record.${col.name} && (
            <div className="mb-2">
              <img src={String(record.${col.name})} alt="Preview" className="h-16 w-16 object-cover rounded-md border" />
            </div>
          )}
          <Input id="${col.name}" name="${col.name}" type="file" accept="image/*" />
          {state?.errors?.${col.name} && (
            <p className="text-xs text-destructive">{state.errors.${col.name}[0]}</p>
          )}
        </div>`;
        }

        return `        <div className="space-y-2">
          <Label htmlFor="${col.name}">${col.name.replace(/_/g, ' ').toUpperCase()}</Label>
          <Input 
            id="${col.name}" 
            name="${col.name}" 
            type="${getHtmlInputProps(col).includes('number') ? 'number' : 'text'}" 
            defaultValue={record.${col.name} !== undefined ? String(record.${col.name}) : ''} 
          />
          {state?.errors?.${col.name} && (
            <p className="text-xs text-destructive">{state.errors.${col.name}[0]}</p>
          )}
        </div>`;
      })
      .join('\n\n');

    const pkBindString = pks.map((pk) => `record.${pk.name}`).join(', ');

    const editFormContent = `'use client';

import React, { useActionState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@/components/ui/dialog';
import { update${pascalName}Action, ActionState } from '@/app/lib/actions/${tableName}-actions';
import { ${pascalName} } from '@/app/lib/types/${pascalName}';

export function Edit${pascalName}Form({ record }: { record: ${pascalName} }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const updateWithKeys = update${pascalName}Action.bind(null, ${pkBindString});

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
      
${editFormFields}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving Changes...' : 'Save Changes'}
      </Button>
    </form>
  );
}
`;

    // ==========================================
    // 3. GENERATE DELETE-DIALOG.TSX (No Changes Needed)
    // ==========================================
    const deleteDialogContent = `'use client';

import React, { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { delete${pascalName}Action } from '@/app/lib/actions/${tableName}-actions';

interface DeleteProps {
  ${pks.map((pk) => `${pk.name}: any`).join(';\n  ')};
}

export default function Delete${pascalName}Button({ ${pks.map((pk) => pk.name).join(', ')} }: DeleteProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await delete${pascalName}Action(${pks.map((pk) => pk.name).join(', ')});
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button 
          style={{
            padding: '6px',
            background: 'transparent',
            border: 'none',
            color: '#dc2626',
            cursor: 'pointer'
          }}
          title="Delete record"
        >
          <Trash2 size={16} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this record from the "${tableName}" table.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
`;

    // ==========================================
    // 4. GENERATE PAGE.TSX (Standard clean modal wrappers!)
    // ==========================================
    const tableHeaderCells = columns
      .map(
        (col) =>
          `                <TableHead>${col.name.replace(/_/g, ' ').toUpperCase()}</TableHead>`
      )
      .join('\n');

    const tableBodyCells = columns
      .map((col) => {
        const isImg =
          col.name.toLowerCase().includes('image') || col.name.toLowerCase().includes('avatar');
        if (isImg) {
          return `                  <TableCell>
                    {item.${col.name} ? (
                      <img src={String(item.${col.name})} alt="Thumbnail" className="h-10 w-10 object-cover rounded border" />
                    ) : (
                      <span className="text-muted-foreground text-xs">No image</span>
                    )}
                  </TableCell>`;
        }
        return `                  <TableCell>{String(item.${col.name})}</TableCell>`;
      })
      .join('\n');

    const pkPassString = pks.map((pk) => `${pk.name}={item.${pk.name}}`).join(' ');

    const pageContent = `import React from 'react';
import { fetchAll${pascalName}s } from '@/app/lib/db-handlers/${tableName}-handlers';
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
import { Create${pascalName}Form } from '@/components/${tableName}/create-form';
import { Edit${pascalName}Form } from '@/components/${tableName}/edit-form';
import Delete${pascalName}Button from '@/components/${tableName}/delete-dialog';

export default async function ${pascalName}Page() {
  const records = await fetchAll${pascalName}s();

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Manage ${pascalName}</CardTitle>
          
          {/* Uncontrolled Create Dialog - Closes internally via <DialogClose> */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Create New</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add ${pascalName} Record</DialogTitle>
              </DialogHeader>
              <Create${pascalName}Form />
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
${tableHeaderCells}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={${columns.length + 1}} className="text-center py-6 text-muted-foreground">
                    No records found in table.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((item: any, idx) => (
                  <TableRow key={idx}>
${tableBodyCells}
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
                              <DialogTitle>Edit ${pascalName} Record</DialogTitle>
                            </DialogHeader>
                            <Edit${pascalName}Form record={item} />
                          </DialogContent>
                        </Dialog>

                        <Delete${pascalName}Button ${pkPassString} />
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
`;

    // Save only the 4 essential files
    fs.writeFileSync(path.join(compDir, 'create-form.tsx'), createFormContent, 'utf8');
    fs.writeFileSync(path.join(compDir, 'edit-form.tsx'), editFormContent, 'utf8');
    fs.writeFileSync(path.join(compDir, 'delete-dialog.tsx'), deleteDialogContent, 'utf8');
    fs.writeFileSync(path.join(pageDir, 'page.tsx'), pageContent, 'utf8');

    // Clean up any old wrapper files if they exist to keep the repository clean
    const oldCreateDialog = path.join(compDir, 'create-dialog.tsx');
    const oldEditDialog = path.join(compDir, 'edit-dialog.tsx');
    if (fs.existsSync(oldCreateDialog)) fs.unlinkSync(oldCreateDialog);
    if (fs.existsSync(oldEditDialog)) fs.unlinkSync(oldEditDialog);

    console.log(`✅ Generated Self-Closing CRUD Views for: ${tableName}`);
  });

  console.log('\n🎉 Clean view system compilation successful!');
}

generateViews();
