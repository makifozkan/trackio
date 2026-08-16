// app/flashcards/page.tsx
import { mockFlashcards } from './data/mock-cards';
import { FlashcardViewer } from './components/flashcard-viewer';

export default function FlashcardsPage() {
  return (
    <main className="container min-h-screen flex flex-col justify-center items-center gap-6 px-4">
      <div className="text-center space-y-2 max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight">Study Flashcards</h1>
        <p className="text-muted-foreground text-sm">
          Review key concepts. Click each card to flip it and test your knowledge.
        </p>
      </div>

      <div className="w-full py-4">
        <FlashcardViewer cards={mockFlashcards} />
      </div>
    </main>
  );
}
