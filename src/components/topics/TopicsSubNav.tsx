'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'All topics', href: '/topics', exact: true },
  { label: 'Summary history', href: '/topics/summary-history' },
  { label: 'Settings', href: '/topics/settings/categories' },
  { label: 'Export topics', href: '/topics/export' },
  { label: 'Deleted topics', href: '/topics/deleted' },
];

export function TopicsSubNav() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <nav className="w-52 shrink-0 border-r border-gray-200 bg-white py-2">
      <ul className="flex flex-col">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-4 py-2.5 text-sm border-l-[3px] transition-colors ${
                  active
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                    : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
