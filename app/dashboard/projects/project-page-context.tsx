'use client';

import { createContext, useEffect, useState } from 'react';

const defaultContext: {
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
} = { loading: false, setLoading: undefined };

export const ProjectPageContext = createContext(defaultContext);

export default function ProjectPageContextProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('ProjectPageContextProvider rendering...', loading);
  });

  return (
    <ProjectPageContext
      value={{
        loading: loading,
        setLoading: setLoading,
      }}
    >
      {children}
    </ProjectPageContext>
  );
}
