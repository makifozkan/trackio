// app/flashcards/components/flashcard-card.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MarkdownRenderer } from './markdown-renderer';
import { Flashcard } from '../types';
import { cn } from '@/lib/utils';

interface FlashcardCardProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlashcardCard({ card, isFlipped, onFlip }: FlashcardCardProps) {
  // Ensure we can handle keyboard triggers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onFlip();
    }
  };

  return (
    <div
      className="w-full max-w-lg h-72 [perspective:1000px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
      onClick={onFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Flashcard: ${isFlipped ? 'back' : 'front'} side`}
    >
      <div
        className={cn(
          'relative w-full h-full duration-500 transition-transform [transform-style:preserve-3d]',
          isFlipped && '[transform:rotateY(180deg)]'
        )}
      >
        {/* Front Side */}
        <Card className="absolute inset-0 w-full h-full [backface-visibility:hidden] flex flex-col justify-between overflow-hidden shadow-md">
          <CardContent className="flex-1 flex flex-col justify-center items-center text-center p-6 overflow-y-auto">
            {card.category && (
              <span className="absolute top-4 left-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {card.category}
              </span>
            )}
            <MarkdownRenderer content={card.front} />
            <span className="absolute bottom-4 text-xs text-muted-foreground/60 select-none">
              Click or press Space to flip
            </span>
          </CardContent>
        </Card>

        {/* Back Side */}
        <Card className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between overflow-hidden shadow-md bg-accent/20">
          <CardContent className="flex-1 flex flex-col justify-center items-center text-left p-6 overflow-y-auto">
            {card.category && (
              <span className="absolute top-4 left-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Answer • {card.category}
              </span>
            )}
            <div className="w-full">
              <MarkdownRenderer content={card.back} />
            </div>
            <span className="absolute bottom-4 text-xs text-muted-foreground/60 select-none">
              Click to flip back
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
