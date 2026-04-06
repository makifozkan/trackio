import Navigation from '@/app/ui/dashboard/navigation';
import { signOut, auth } from '@/auth';

export default async function SideNav() {
  const session = await auth();

  const handleSignOut = async () => {
    'use server';
    await signOut({ redirectTo: '/' });
  };

  return (
    <Navigation 
      user={session?.user} 
      signOutAction={handleSignOut} 
    />
  );
}