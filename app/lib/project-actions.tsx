'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Project, Task } from './definitions';
import { collection, addDoc } from 'firebase/firestore';
import firestore from './firebase';

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
    await creativeProjectInFirestore(parsedData);

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
    } catch (error) {
        console.error('Error creating project:', error);
        return {
            message: 'An error occurred while creating the project.',
        }
    }

    revalidatePath('/dashboard/projects');
    redirect('/dashboard/projects');
}

export async function fetchProjects() {
    try {
        const projects = await sql`
            SELECT id, name, description, status, source_idea_id
            FROM projects
        `;
        return projects;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

// fetch project by id with tasks and sub-tasks by joining projects and tasks tables
export async function fetchProjectById(projectId: string) {
    try {
        const projectData = await sql`
            SELECT p.id, p.name, p.description, p.status, p.source_idea_id,
                json_agg(json_build_object(
                    'id', t.id,
                    'name', t.name,
                    'description', t.description,
                    'sub_tasks', (
                        SELECT json_agg(json_build_object(
                            'id', st.id,
                            'name', st.name,
                            'description', st.description
                        ))
                        FROM tasks st
                        WHERE st.parent_task_id = t.id
                    )
                )) AS tasks
            FROM projects p
            LEFT JOIN tasks t ON p.id = t.project_id
            WHERE p.id = ${projectId}
            GROUP BY p.id
        `;
        return projectData;
    } catch (error) {
        console.error('Error fetching project by ID:', error);
        return null;
    }
}


export async function deleteProject(projectId: string) {
    try {
        await sql.begin(async (sql) => {
            await sql`
                DELETE FROM tasks
                WHERE project_id = ${projectId}
            `;

            await sql`
                DELETE FROM projects
                WHERE id = ${projectId}
            `;
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        return;
    }

    revalidatePath('/dashboard/projects');
    redirect('/dashboard/projects');
}


export async function fetchFilteredProjects(query: string, currentPage: number) {
    const ITEMS_PER_PAGE = 10;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const projects = await sql<Project[]>`
            SELECT projects.id, projects.name, projects.description, projects.status, 
                projects.source_idea_id,
                json_build_object('id', ideas.id, 'title', ideas.title) AS source_idea
            FROM projects
            LEFT JOIN ideas ON projects.source_idea_id = ideas.id
            WHERE projects.name ILIKE ${`%${query}%`}
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;
        return projects;
    } catch (error) {
        console.error('Error fetching filtered projects:', error);
        return [];
    }
}


export async function creativeProjectInFirestore(project: Partial<Project>) {
    try {
        // Assuming you have a Firestore instance initialized as `db`
        const docRef = await addDoc(collection(firestore.db, 'projects'), project);
        console.log('Project created with ID:', docRef.id);
    } catch (error) {
        console.error('Error creating project in Firestore:', error);
    }
}