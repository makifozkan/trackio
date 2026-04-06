import { fetchSavedIdeas } from "@/app/lib/ideas-actions";

export async function GET() {
    const ideas = await fetchSavedIdeas();
    return new Response(JSON.stringify(ideas), {
        headers: { 'Content-Type': 'application/json' }
    });
}