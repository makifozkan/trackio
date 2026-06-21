import { fetchProjectById } from '@/app/lib/project-actions';

export async function GET(request: Request, ctx: RouteContext<'/api/projects/[id]'>) {
  const { id } = await ctx.params;
  const project = await fetchProjectById(id);
  return new Response(JSON.stringify(project), {
    headers: { 'Content-Type': 'application/json' },
  });
}
