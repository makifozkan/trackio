// app/flashcards/types/index.ts
export interface Flashcard {
  id: string;
  front: string; // Markdown text
  back: string; // Markdown text
  category?: string;
  tags?: string[];
}
