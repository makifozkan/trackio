const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname, 'schema-diagram.json');

// Define targets relative to project root
const componentsBaseDir = path.join(__dirname, 'components');
const appDashboardBaseDir = path.join(__dirname, 'app', 'dashboard');

// Helper to convert to PascalCase
function toPascalCase(str) {
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+(.)(\w*)/g, ($1, $2, $3) => $2.toUpperCase() + $3.toLowerCase())
    .replace(/\w/, (s) => s.toUpperCase());
}

// Helper to map SQL types to HTML input types
function getHtmlInputType(sqlType) {
  const type = sqlType.toUpperCase();
  if (
    type.includes('INT') ||
    type.includes('DECIMAL') ||
    type.includes('BIGINT') ||
    type === 'SERIAL'
  ) {
    return 'number';
  }
  return 'text';
}

function generateViews() {
  // 1. Verify schema diagram file exists
  if (!fs.existsSync(jsonFilePath)) {
    console.error(`❌ Error: Could not find "schema-diagram.json" in your project root.`);
    return;
  }

  // 2. Read and parse diagram JSON
  const rawData = fs.readFileSync(jsonFilePath, 'utf8');
  let diagramData;
  try {
    diagramData = JSON.parse(rawData);
  } catch (err) {
    console.error('❌ Error parsing schema-diagram.json:', err.message);
    return;
  }

  const { nodes } = diagramData;
  if (!nodes) {
    console.error('❌ Invalid JSON: "nodes" property is missing.');
    return;
  }

  // 3. Filter out DB Table nodes
  const dbTableNodes = nodes.filter((node) => node.type === 'dbTable');

  if (dbTableNodes.length === 0) {
    console.log('ℹ️ No DB Table nodes found. Skipping views generation.');
    return;
  }

  // 4. Generate views for each table
  dbTableNodes.forEach((node) => {
    const { tableName, columns } = node.data;
    if (!tableName || !columns) return;

    const pascalName = toPascalCase(tableName);
    const pks = columns.filter((col) => col.isPK);

    // Non-PK and non-auto generated columns for form inputs
    const inputCols = columns.filter(
      (col) =>
        !col.isPK &&
        !(col.defaultValue && col.defaultValue.trim() !== '') &&
        col.type.toUpperCase() !== 'SERIAL'
    );

    // Create target folders
    const compDir = path.join(componentsBaseDir, tableName);
    const pageDir = path.join(appDashboardBaseDir, tableName);

    fs.mkdirSync(compDir, { recursive: true });
    fs.mkdirSync(pageDir, { recursive: true });

    // ==========================================
    // A. GENERATE CREATE-FORM.TSX (Client Component)
    // ==========================================
    const createFormFields = inputCols
      .map((col) => {
        const type = getHtmlInputType(col.type);
        return `        <div className="space-y-2">
          <Label htmlFor="${col.name}">${col.name.replace(/_/g, ' ').toUpperCase()}</Label>
          <Input id="${col.name}" name="${col.name}" type="${type}" placeholder="Enter ${col.name}" />
          {state?.errors?.${col.name} && (
            <p className="text-xs text-destructive">{state.errors.${col.name}[0]}</p>
          )}
        </div>`;
      })
      .join('\n\n');

    const createFormContent = `'use client';

import React, { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { create${pascalName}Action, ActionState } from '@/app/lib/actions/${tableName}-actions';

export function Create${pascalName}Form({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (prevState, formData) => {
      const res = await create${pascalName}Action(prevState, formData);
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
      
${createFormFields}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : 'Create ${pascalName}'}
      </Button>
    </form>
  );
}
`;

    // ==========================================
    // B. GENERATE EDIT-FORM.TSX (Client Component)
    // ==========================================
    const editFormFields = inputCols
      .map((col) => {
        const type = getHtmlInputType(col.type);
        return `        <div className="space-y-2">
          <Label htmlFor="${col.name}">${col.name.replace(/_/g, ' ').toUpperCase()}</Label>
          <Input 
            id="${col.name}" 
            name="${col.name}" 
            type="${type}" 
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

import React, { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { update${pascalName}Action, ActionState } from '@/app/lib/actions/${tableName}-actions';
import { ${pascalName} } from '@/app/lib/types/${pascalName}';

export function Edit${pascalName}Form({ record, onSuccess }: { record: ${pascalName}; onSuccess?: () => void }) {
  const updateWithKeys = update${pascalName}Action.bind(null, ${pkBindString});

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (prevState, formData) => {
      const res = await updateWithKeys(prevState, formData);
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
      
${editFormFields}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving Changes...' : 'Save Changes'}
      </Button>
    </form>
  );
}
`;

    // ==========================================
    // C. GENERATE DELETE-DIALOG.TSX (Client Component)
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
            This action cannot be undone. This will permanently delete this record from the &quot;${tableName}&quot; table.
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
    // D. GENERATE PAGE.TSX (Server Component)
    // ==========================================
    const tableHeaderCells = columns
      .map(
        (col) =>
          `                <TableHead>${col.name.replace(/_/g, ' ').toUpperCase()}</TableHead>`
      )
      .join('\n');
    const tableBodyCells = columns
      .map((col) => `                  <TableCell>{String(item.${col.name})}</TableCell>`)
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
          
          {/* Create Modal Dialog */}
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
                        
                        {/* Edit Modal Dialog */}
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

                        {/* Delete Action Trigger */}
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

    // Write all four compiled visual assets to disk
    fs.writeFileSync(path.join(compDir, 'create-form.tsx'), createFormContent, 'utf8');
    fs.writeFileSync(path.join(compDir, 'edit-form.tsx'), editFormContent, 'utf8');
    fs.writeFileSync(path.join(compDir, 'delete-dialog.tsx'), deleteDialogContent, 'utf8');
    fs.writeFileSync(path.join(pageDir, 'page.tsx'), pageContent, 'utf8');

    console.log(`✅ Generated UI Assets for: ${tableName}`);
    console.log(`   └─ components/${tableName}/create-form.tsx`);
    console.log(`   └─ components/${tableName}/edit-form.tsx`);
    console.log(`   └─ components/${tableName}/delete-dialog.tsx`);
    console.log(`   └─ app/dashboard/${tableName}/page.tsx`);
  });

  console.log('\n🎉 Front-end page and views generation complete!');
}

generateViews();
