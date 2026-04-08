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
    description: z.string().describe("Detailed description of the task with clear instructions."),
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
    const fullCyclePrompt = `Create a detailed non-generic project plan with tasks and sub-tasks for the following project idea: ${idea}`;

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