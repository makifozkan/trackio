import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div
        className="flex flex-col flex-1 overflow-y-auto p-6 md:p-12"
        style={{ backgroundColor: 'oklch(96.7% 0.003 264.542)' }}
      >
        {children}
      </div>
    </div>
  );
}
