import { generateIdeas } from "@/app/lib/gemini-actions";
import Card from "./hyperui-card";
import { Suspense } from "react";

export default async function InspirationalIdeaCards() {
    const ideas = await generateIdeas(["tech"]);

    return (
        <>
            {ideas.map((idea) => (<Card key={idea.title} {...idea} />))}
        </>);
}