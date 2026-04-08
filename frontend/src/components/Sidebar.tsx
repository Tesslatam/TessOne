'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  Truck,
  FileText,
  UserCircle,
  Building2,
} from 'lucide-react';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Clientes',
    href: '/clients',
    icon: Users,
  },
   {
    name: 'Organización',
    href: '/organization',
    icon: Building2,
  },
  {
    name: 'Productos',
    href: '/products',
    icon: Package,
  },
  {
    name: 'Proveedores',
    href: '/providers',
    icon: Truck,
  },
  {
    name: 'Facturas',
    href: '/invoices',
    icon: FileText,
  },
  {
    name: 'Mi cuenta',
    href: '/account',
    icon: UserCircle,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#141427] text-white p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">TessOne</h1>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? 'bg-purple-600'
                  : 'hover:bg-white/10 text-gray-300'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 text-sm text-gray-400">
        © {new Date().getFullYear()} TessOne
      </div>
    </aside>
  );
}
