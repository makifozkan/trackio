'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Project, Task } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const TaskSchema: z.ZodType<Partial<Task>> = z.lazy(() => z.object({
    id: z.string(),
    name: z.string(),
    duration: z.number().optional(),
    description: z.string(),
    sub_tasks: z.array(TaskSchema),
}));

const ProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    status: z.string().optional(),
    tasks: z.array(TaskSchema),
    source_idea_id: z.string(),
});


export type State = {
    errors?: {
        name?: string[];
        description?: string[];
    };
    message?: string | null;
};


export async function createProject(prevState: State, data: FormData) {
    const rawData = data.get("projectData") as string;
    const parsedData = JSON.parse(rawData) as Partial<Project>;
    console.log("Parsed data:", parsedData);

    const validatedFields = ProjectSchema.safeParse({
        id: parsedData.id,
        name: parsedData.name,
        description: parsedData.description,
        status: parsedData.status,
        tasks: parsedData.tasks,
        source_idea_id: parsedData.source_idea_id,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Project.',
        }
    }

    const { id, name, description, status, tasks, source_idea_id } = validatedFields.data;

    try {
        await sql.begin(async (sql) => {
            const [project] = await sql`
                INSERT INTO projects (name, description, source_idea_id)
                VALUES (${name}, ${description}, ${source_idea_id})
                RETURNING id
            `;

            async function insertTasks(tasks: Partial<Task>[], parentId = null) {
                for (const task of tasks) {
                    const [insertedTask] = await sql`
                        INSERT INTO tasks (project_id, name, description, parent_task_id)
                        VALUES (${project.id}, ${task.name || ""}, ${task.description || ""}, ${parentId})
                        RETURNING id
                    `;


                    if (task.sub_tasks?.length || 0 > 0) {
                        await insertTasks(task.sub_tasks || [], insertedTask.id);
                    }
                }
            }

            await insertTasks(tasks);
        });

        revalidatePath('/dashboard/projects');
        redirect('/dashboard/projects');
    } catch (error) {
        console.error('Error creating project:', error);
        return {
            message: 'An error occurred while creating the project.',
        }
    }

}