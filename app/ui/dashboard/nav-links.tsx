'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  Square3Stack3DIcon,
  QueueListIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
const links = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Ideas', href: '/dashboard/ideas', icon: LightBulbIcon },
  { name: 'Invoices', href: '/dashboard/invoices', icon: DocumentDuplicateIcon },
  { name: 'Projects', href: '/dashboard/projects', icon: Square3Stack3DIcon },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
  { name: 'Explorer', href: '/dashboard/explorer', icon: RocketLaunchIcon },
  { name: 'Taskmaster', href: '/dashboard/taskmaster', icon: QueueListIcon },
  { name: 'Launchpad', href: '/dashboard/launchpad', icon: RocketLaunchIcon },
];

export default function NavLinks({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;

        return (
          <li key={link.name}>
            <Link
              href={link.href}
              onClick={onItemClick}
              className={clsx(
                'group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
              )}
            >
              {/* Active Pill Indicator */}
              {isActive && (
                <span className="absolute left-0 h-4 w-1 rounded-r-full bg-indigo-600" />
              )}

              <LinkIcon
                className={clsx(
                  'h-5 w-5 transition-colors',
                  isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'
                )}
              />
              {link.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
