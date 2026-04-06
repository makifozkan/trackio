"use server";

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

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