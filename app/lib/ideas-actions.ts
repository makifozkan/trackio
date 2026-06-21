'use server';
import { z } from 'zod';
import { Idea } from './definitions';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getActiveUser } from './actions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const IdeaSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  categories: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  status: z
    .enum(['High Potential', 'Active Test', 'Paused', 'High Alpha', 'Draft'])
    .default('Draft'),
  is_ai_generated: z.boolean().default(false),
  created_at: z.string().optional(),
});

const CreateIdea = IdeaSchema.omit({ id: true, created_at: true });

type State = {
  errors?: {
    title?: string[];
    description?: string[];
    categories?: string[];
    keywords?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createIdea(prevState: State, formData: FormData) {
  const validatedFields = CreateIdea.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    status: formData.get('status'),
    categories: formData.get('categories')
      ? (formData.get('categories') as string).split(',').map((s) => s.trim())
      : [],
    keywords: formData.get('keywords')
      ? (formData.get('keywords') as string).split(',').map((s) => s.trim())
      : [],
    is_ai_generated: formData.get('is_ai_generated') === 'true',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Idea.',
    };
  }

  const active_user = await getActiveUser();

  if (!active_user || !active_user.id) {
    return {
      message: 'Authentication Error: User not logged in.',
    };
  }

  const { title, description, categories, keywords, status, is_ai_generated } =
    validatedFields.data;

  try {
    await sql`
            INSERT INTO ideas (title, description, categories, keywords, status, is_ai_generated, user_id)
            VALUES (${title}, ${description}, ${categories}, ${keywords}, ${status}, ${is_ai_generated}, ${active_user?.id})
        `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Idea.',
    };
  }

  revalidatePath('/dashboard/ideas');
  redirect('/dashboard/ideas');
}

export async function deleteIdea(id: string) {
  try {
    await sql`DELETE FROM ideas WHERE id = ${id}`;
    revalidatePath('/dashboard/ideas');
    return { message: 'Deleted Idea.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Idea.' };
  }
}

export async function updateIdeaStatus(id: string, status: string) {
  try {
    await sql`
            UPDATE ideas
            SET status = ${status}
            WHERE id = ${id}
        `;
    revalidatePath('/dashboard/ideas');
  } catch (error) {
    return { message: 'Database Error: Failed to Update Idea Status.' };
  }
}

export async function fetchSavedIdeas() {
  try {
    const ideas = await sql`
            SELECT
                id,
                title,
                description,
                categories,
                keywords,
                status,
                is_ai_generated,
                created_at
            FROM ideas
            ORDER BY created_at DESC
        `;
    return ideas;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch ideas.');
  }
}

// Keep the old saveIdea for background/AI tasks but update it to use the new schema
export async function saveIdea(idea: any) {
  const parsedIdea = IdeaSchema.safeParse(idea);
  if (!parsedIdea.success) {
    throw new Error('Invalid idea data: ' + JSON.stringify(parsedIdea.error.issues));
  }

  const { title, description, categories, keywords, status, is_ai_generated } = parsedIdea.data;

  try {
    await sql`
            INSERT INTO ideas (title, description, categories, keywords, status, is_ai_generated)
            VALUES (${title}, ${description}, ${categories}, ${keywords}, ${status}, ${is_ai_generated})
        `;
  } catch (error) {
    console.error('Error saving idea:', error);
    throw new Error('Data error: Failed to save idea.');
  }
}

export async function fetchIdeas() {
  try {
    const ideas = await sql<Idea[]>`
            SELECT * FROM ideas`;
    return ideas;
  } catch (error) {
    console.error('Error fetching ideas:', error);
    throw new Error('Data error: Failed to fetch ideas.');
  }
}

export async function fetchIdeasByUserId(userId?: string) {
  if (!userId) {
    throw new Error('Authentication Error: User ID is required to fetch ideas.');
  }

  try {
    const ideas = await sql<Idea[]>`
            SELECT * FROM ideas WHERE user_id = ${userId} ORDER BY created_at DESC`;
    return ideas;
  } catch (error) {
    console.error('Error fetching ideas by user ID:', error);
    throw new Error('Data error: Failed to fetch ideas by user ID.');
  }
}
