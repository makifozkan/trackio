'use client';

import { useRouter } from 'next/navigation';

export default function Clickable({ children, id }: { children: React.ReactNode; id?: string }) {
  const router = useRouter();

  const onClick = () => {
    if (id) {
      router.push(`/dashboard/projects?projectId=${id}`);
    } else {
      router.push('/dashboard/projects');
    }
  };

  return (
    <div onClick={onClick} className="cursor-pointer">
      {children}
    </div>
  );
}
