"use server";

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { Idea, Project, Task } from "./definitions";

const ingredientSchema = z.object({
    name: z.string().describe("Name of the ingredient."),
    quantity: z.string().describe("Quantity of the ingredient, including units."),
});

const recipeSchema = z.object({
    recipe_name: z.string().describe("The name of the recipe."),
    prep_time_minutes: z.number().optional().describe("Optional time in minutes to prepare the recipe."),
    ingredients: z.array(ingredientSchema),
    instructions: z.array(z.string()),
});

const ideaSchema = z.object({
    title: z.string().describe("Title of the suggested idea."),
    description: z.string().describe("Short description of the suggested idea."),
});

const taskSchema: z.ZodType<Partial<Task>> = z.lazy(() => z.object({
    id: z.string().optional().describe("Unique identifier for the task."),
    name: z.string().describe("Name of the task."),
    description: z.string().describe("Description of the task."),
    duration: z.number().describe("Estimated duration of the task in days."),
    category: z.string().describe("Category of the task, e.g., Frontend, Backend, Security."),
    sub_tasks: z.array(taskSchema).describe("List of sub-tasks under this task."),
}));


const projectPlanSchema: z.ZodType<Partial<Project>> = z.object({
    name: z.string().describe("The name of the project."),
    tasks: z.array(taskSchema),
})

const ideasSchema = z.object({
    ideas: z.array(ideaSchema),
});

const ai = new GoogleGenAI({});

const prompt = (keyword: string[]) => `
Please suggest 4 business, product, or any other type of inspirational ideas that's relevant to the keywords below.

Keywords:
${keyword.map((k) => `- ${k}`).join("\n")}
`;


export async function generateIdeas(keywords: string[]) {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt(keywords),
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(ideasSchema),
        },
    });
    if (response?.text) {
        return ideasSchema.parse(JSON.parse(response.text))?.ideas;
    }

    return [];
}

export async function generateProjectPlan(idea: string) {
    const fullCyclePrompt = `
        Act as an expert Project Manager and Product Strategist. 
        Generate a comprehensive, absolute full-cycle project plan for a typical product launch based on the following idea: "${idea}".
        
        The plan must cover the entire end-to-end lifecycle, including but not limited to:
        - Conceptualization & Market Research
        - Technical Architecture & UI/UX Design
        - Initial MVP Development (Frontend, Backend, Database, etc.)
        - Security, Compliance & Risk Assessment
        - Quality Assurance (Testing, Bug Fixing, User Acceptance)
        - DevOps (CI/CD Setup, Cloud Infrastructure, Deployment)
        - Go-to-Market Strategy (Launch Prep, Marketing Campaigns, PR)
        - Post-Launch (Monitoring, Feedback Collection, Analytics)

        TECH STACK GUIDELINES:
        - For Web Development: Prefer Vercel and Next.js.
        - For Mobile Development: Prefer Flutter.
        - For other essential project tasks where no specific preference is given (e.g., Email Marketing, Analytics, CRM, Auth, Database, etc.), suggest and integrate the most valuable publicly available tools (e.g., Resend, Postmark, Google Analytics, Mixpanel, Clerk, Supabase, etc.).
        - If the idea doesn't fit these specifically, or if a different stack provides significantly more value/speed for this specific idea, use the one that offers the most value.
        - Ensure tasks reflect the specific workflows and integration steps of these tools (e.g., 'Configure Resend for transactional emails', 'Deploy to Vercel', 'Next.js Middleware setup', 'Flutter widget testing', 'Setup Clerk Authentication').

        CRITICAL CONSTRAINTS:
        1. TASK BREAKDOWN: The smallest unit of work must be granular. The 'duration' for any single task unit MUST NOT exceed 3 days for a single headcount.
        2. GRANULARITY: If a task or deliverable naturally takes longer than 3 days, you MUST break it down into multiple smaller, sequential, or parallel sub-tasks.
        3. ACCURACY: Ensure the 'duration' accurately reflects the complexity while staying within the 3-day limit per unit.
        4. CATEGORIZATION: Assign appropriate categories (e.g., "Frontend", "Backend", "DevOps", "Marketing", "Legal", etc.) to every task.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: fullCyclePrompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(projectPlanSchema),
        },
    });
    if (response?.text) {
        return projectPlanSchema.parse(JSON.parse(response.text))?.tasks;
    }
}

export async function chatWithGemini(messages: { role: "user" | "assistant"; content: string }[]) {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messages.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n"),
    });
    return response?.text;
}