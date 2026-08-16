// app/flashcards/components/markdown-renderer.tsx
'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-sm max-w-full text-foreground space-y-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => <h1 className="text-lg font-bold my-1" {...props} />,
          h2: ({ ...props }) => <h2 className="text-md font-semibold my-1" {...props} />,
          h3: ({ ...props }) => <h3 className="text-sm font-semibold my-1" {...props} />,
          p: ({ ...props }) => <p className="text-sm leading-relaxed my-1" {...props} />,
          ul: ({ ...props }) => <ul className="list-disc pl-5 my-1 space-y-1 text-sm" {...props} />,
          ol: ({ ...props }) => (
            <ol className="list-decimal pl-5 my-1 space-y-1 text-sm" {...props} />
          ),
          li: ({ ...props }) => <li className="my-0" {...props} />,
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                {children}
              </code>
            ) : (
              <pre className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto my-2 border border-border">
                <code {...props}>{children}</code>
              </pre>
            );
          },
          strong: ({ ...props }) => <strong className="font-semibold text-primary" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
