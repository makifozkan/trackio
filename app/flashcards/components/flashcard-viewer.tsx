// app/flashcards/components/flashcard-viewer.tsx
'use client';

import { useState } from 'react';
import { Flashcard } from '../types';
import { FlashcardCard } from './flashcard-card';
import { Button as ShadcnButton } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCw, Shuffle } from 'lucide-react';

interface FlashcardViewerProps {
  cards: Flashcard[];
}

export function FlashcardViewer({ cards }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState<Flashcard[]>(cards);

  const currentCard = deck[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    // Add small delay to let the flip animation finish before slide changes
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % deck.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
    }, 150);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const shuffled = [...deck].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
      setCurrentIndex(0);
    }, 150);
  };

  if (!currentCard) {
    return <div className="text-center p-8">No flashcards found.</div>;
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      {/* Deck progress display */}
      <div className="flex justify-between items-center w-full px-1 text-sm text-muted-foreground">
        <span>
          Card {currentIndex + 1} of {deck.length}
        </span>
        {currentCard.tags && (
          <div className="flex gap-1">
            {currentCard.tags.map((tag) => (
              <span key={tag} className="bg-muted px-2 py-0.5 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Card */}
      <FlashcardCard
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped(!isFlipped)}
      />

      {/* Control Buttons */}
      <div className="flex items-center justify-between w-full gap-2 px-1">
        <ShadcnButton variant="outline" size="icon" onClick={handlePrev} title="Previous Card">
          <ChevronLeft className="h-4 w-4" />
        </ShadcnButton>

        <ShadcnButton
          variant="outline"
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex gap-2 items-center"
        >
          <RotateCw className="h-4 w-4" />
          Flip
        </ShadcnButton>

        <ShadcnButton variant="outline" size="icon" onClick={handleShuffle} title="Shuffle Deck">
          <Shuffle className="h-4 w-4" />
        </ShadcnButton>

        <ShadcnButton variant="outline" size="icon" onClick={handleNext} title="Next Card">
          <ChevronRight className="h-4 w-4" />
        </ShadcnButton>
      </div>
    </div>
  );
}
