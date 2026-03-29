import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut, auth } from '@/auth';


export default async function SideNav() {
  const session = await auth();
  console.log('session', session);

  return (
    <div className="flex h-screen flex-col justify-between border-e border-gray-100 bg-white">
      <div className="px-4 py-6">
        <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M35.7131 12.2464C35.3583 12.1898 35.3998 11.6667 35.759 11.6667H57.6041C58.0068 11.6667 58.3333 11.9932 58.3333 12.3959V34.241C58.3333 34.6002 57.8103 34.6418 57.7536 34.287L54.8851 16.3251C54.7856 15.7025 54.2975 15.2144 53.6749 15.115L35.7131 12.2464Z" fill="black" stroke="black" strokeWidth="2" strokeLinecap="round" />
          <path d="M9.46304 38.4964C9.10829 38.4397 9.14979 37.9167 9.50904 37.9167H31.3541C31.7567 37.9167 32.0832 38.2433 32.0832 38.6459V60.491C32.0832 60.8502 31.5603 60.8918 31.5036 60.537L28.635 42.5751C28.5356 41.9525 28.0475 41.4644 27.4249 41.365L9.46304 38.4964Z" fill="black" stroke="black" strokeWidth="2" strokeLinecap="round" />
          <path d="M22.5881 25.3714C22.2333 25.3147 22.2748 24.7917 22.634 24.7917H44.4791C44.8818 24.7917 45.2083 25.1183 45.2083 25.5209V47.366C45.2083 47.7252 44.6853 47.7668 44.6286 47.412L41.9267 30.4935C41.7278 29.2486 40.7515 28.2722 39.5065 28.0733L22.5881 25.3714Z" fill="black" stroke="black" strokeWidth="2" strokeLinecap="round" />
        </svg>

        <ul className="mt-6 space-y-1">


          <NavLinks />
          <li>
            <details className="group [&amp;_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <span className="text-sm font-medium"> Teams </span>

                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </span>
              </summary>

              <ul className="mt-2 space-y-1 px-4">
                <li>
                  <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                    Banned Users
                  </a>
                </li>

                <li>
                  <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                    Calendar
                  </a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details className="group [&amp;_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <span className="text-sm font-medium"> Account </span>

                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </span>
              </summary>

              <ul className="mt-2 space-y-1 px-4">
                <li>
                  <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                    Details
                  </a>
                </li>

                <li>
                  <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                    Security
                  </a>
                </li>

                <li>
                  <form action={async () => {
                    'use server';
                    await signOut({ redirectTo: '/' });
                  }}>                                    <button className="w-full rounded-lg px-4 py-2 [text-align:_inherit] text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                      Logout
                    </button></form>

                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
        <a href="#" className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
          <img alt="" src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?auto=format&amp;fit=crop&amp;q=80&amp;w=1160" className="size-10 rounded-full object-cover" />

          <div>
            <p className="text-xs">
              <strong className="block font-medium">{session?.user?.name}</strong>

              <span> {session?.user?.email}</span>
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}
