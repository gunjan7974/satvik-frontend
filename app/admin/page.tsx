import Link from 'next/link';

export default function AdminIndexPage() {
  const sections = [
    { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard' },
    { id: 'menu', label: 'Menu Management', href: '/admin/menu' },
    { id: 'orders', label: 'Orders', href: '/admin/orders' },
    { id: 'events', label: 'Events', href: '/admin/events' },
    { id: 'blog', label: 'Blog', href: '/admin/blog' },
    { id: 'contacts', label: 'Contacts', href: '/admin/contacts' },
    { id: 'analytics', label: 'Analytics', href: '/admin/analytics' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-sm text-gray-600">Quick links to admin sections</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link key={s.id} href={s.href} className="block p-4 bg-white rounded-lg shadow hover:shadow-md border">
            <h3 className="font-semibold">{s.label}</h3>
            <p className="text-xs text-gray-500">Manage {s.label.toLowerCase()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
