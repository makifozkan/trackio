import { Suspense } from 'react';
import { fetchSavedIdeas } from '@/app/lib/ideas-actions';
import { IdeasHeader } from '@/app/ui/ideas/ideas-header';
import { IdeaCard } from '@/app/ui/ideas/idea-card';
import { IdeaCardsSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ideas | Trackio',
};

async function IdeasList() {
  const ideas = await fetchSavedIdeas();

  if (ideas.length === 0) {
    return (
      <div className="mt-20 flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-gray-50 p-6">
          <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">No ideas yet</h3>
        <p className="mt-2 text-sm text-gray-500">Get started by creating your first market hypothesis.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {ideas.map((idea: any) => (
        <IdeaCard 
            key={idea.id} 
            title={idea.title}
            description={idea.description}
            tags={idea.keywords || []}
            status={idea.status}
            updatedAt={new Date(idea.created_at).toLocaleDateString()}
        />
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto">
        <IdeasHeader />
        
        <Suspense fallback={<IdeaCardsSkeleton />}>
          <IdeasList />
        </Suspense>
      </div>
    </main>
  );
}