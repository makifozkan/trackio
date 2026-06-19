'use server';
import { z } from 'zod';
import { Idea } from './definitions';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type ExplorerFormState = {
    errors?: {
        status?: string[];
    };
    message?: string | null;
};

export async function saveTaskExploration(prevState: ExplorerFormState, formData: FormData): Promise<ExplorerFormState> {

    
    return {
        message: 'Task exploration saved successfully'
    };
}