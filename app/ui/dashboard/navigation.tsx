'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bars3Icon,
  XMarkIcon,
  PowerIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import NavLinks from './nav-links';
import Image from 'next/image';

interface NavProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  signOutAction?: () => void;
}

export default function Navigation({ user, signOutAction }: NavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="flex h-16 items-center justify-between bg-white px-4 border-b border-gray-100 md:hidden sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <svg
            width="32"
            height="32"
            viewBox="0 0 70 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M35.7131 12.2464C35.3583 12.1898 35.3998 11.6667 35.759 11.6667H57.6041C58.0068 11.6667 58.3333 11.9932 58.3333 12.3959V34.241C58.3333 34.6002 57.8103 34.6418 57.7536 34.287L54.8851 16.3251C54.7856 15.7025 54.2975 15.2144 53.6749 15.115L35.7131 12.2464Z"
              fill="black"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M9.46304 38.4964C9.10829 38.4397 9.14979 37.9167 9.50904 37.9167H31.3541C31.7567 37.9167 32.0832 38.2433 32.0832 38.6459V60.491C32.0832 60.8502 31.5603 60.8918 31.5036 60.537L28.635 42.5751C28.5356 41.9525 28.0475 41.4644 27.4249 41.365L9.46304 38.4964Z"
              fill="black"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M22.5881 25.3714C22.2333 25.3147 22.2748 24.7917 22.634 24.7917H44.4791C44.8818 24.7917 45.2083 25.1183 45.2083 25.5209V47.366C45.2083 47.7252 44.6853 47.7668 44.6286 47.412L41.9267 30.4935C41.7278 29.2486 40.7515 28.2722 39.5065 28.0733L22.5881 25.3714Z"
              fill="black"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-bold text-lg tracking-tight">ATELIER</span>
        </div>
        <button
          onClick={toggleMenu}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* SideNav Drawer Overlay */}
      <div
        className={clsx(
          'fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-xs transition-opacity md:hidden',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={toggleMenu}
      />

      {/* SideNav Content (Drawer on mobile, Sidebar on desktop) */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-[#f2f4f6] transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:flex md:flex-col md:h-screen md:border-e md:border-gray-100',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto px-4 py-8">
          {/* Logo Section */}
          <div className="flex items-center gap-3 px-2 mb-8 hidden md:flex">
            <svg
              width="40"
              height="40"
              viewBox="0 0 70 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M35.7131 12.2464C35.3583 12.1898 35.3998 11.6667 35.759 11.6667H57.6041C58.0068 11.6667 58.3333 11.9932 58.3333 12.3959V34.241C58.3333 34.6002 57.8103 34.6418 57.7536 34.287L54.8851 16.3251C54.7856 15.7025 54.2975 15.2144 53.6749 15.115L35.7131 12.2464Z"
                fill="black"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M9.46304 38.4964C9.10829 38.4397 9.14979 37.9167 9.50904 37.9167H31.3541C31.7567 37.9167 32.0832 38.2433 32.0832 38.6459V60.491C32.0832 60.8502 31.5603 60.8918 31.5036 60.537L28.635 42.5751C28.5356 41.9525 28.0475 41.4644 27.4249 41.365L9.46304 38.4964Z"
                fill="black"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M22.5881 25.3714C22.2333 25.3147 22.2748 24.7917 22.634 24.7917H44.4791C44.8818 24.7917 45.2083 25.1183 45.2083 25.5209V47.366C45.2083 47.7252 44.6853 47.7668 44.6286 47.412L41.9267 30.4935C41.7278 29.2486 40.7515 28.2722 39.5065 28.0733L22.5881 25.3714Z"
                fill="black"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-bold text-xl tracking-tight">ATELIER</span>
          </div>

          <nav className="flex-1 space-y-8">
            <div>
              <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#44474c] mb-4">
                Main Menu
              </p>
              <NavLinks onItemClick={() => setIsOpen(false)} />
            </div>

            <div>
              <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#44474c] mb-4">
                Workspace
              </p>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/dashboard/projects"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-white hover:text-indigo-600 transition-all"
                  >
                    Active Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/explorer"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-white hover:text-indigo-600 transition-all"
                  >
                    Market Research
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* User Profile Section */}
          <div className="mt-auto pt-8 border-t border-gray-200/50">
            <div className="flex items-center gap-3 px-2 mb-6">
              {user?.image ? (
                <Image
                  width={100}
                  height={100}
                  src={user.image}
                  alt={user.name || 'User profile'}
                  className="h-10 w-10 rounded-full object-cover shadow-xs border border-white"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-white">
                  <UserCircleIcon className="h-6 w-6" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">
                  {user?.name || 'User Name'}
                </p>
                <p className="text-[10px] text-gray-500 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>

            <button
              onClick={() => signOutAction?.()}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <PowerIcon className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
