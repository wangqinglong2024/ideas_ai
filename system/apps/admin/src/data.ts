import { Bell, Blocks, BookOpen, ClipboardCheck, Coins, Factory, Flag, Gauge, Headphones, Landmark, ListChecks, LockKeyhole, ScrollText, ShieldAlert, ShoppingCart, Users } from 'lucide-react';

export const nav = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: Gauge },
  { path: '/admin/content/articles', label: 'Discover China', icon: Landmark },
  { path: '/admin/content/courses', label: 'Courses', icon: BookOpen },
  { path: '/admin/content/games', label: 'Games', icon: Blocks },
  { path: '/admin/content/novels', label: 'Novels', icon: ScrollText },
  { path: '/admin/content/factory', label: 'Content Factory', icon: Factory },
  { path: '/admin/content/review', label: 'Review', icon: ClipboardCheck },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/admin/coins', label: 'Coins', icon: Coins },
  { path: '/admin/referral', label: 'Referral', icon: ListChecks },
  { path: '/admin/cs/workbench', label: 'CS Workbench', icon: Headphones },
  { path: '/admin/settings/feature-flags', label: 'Feature Flags', icon: Flag },
  { path: '/admin/audit', label: 'Audit', icon: LockKeyhole },
  { path: '/admin/settings/announcements', label: 'Announcements', icon: Bell },
  { path: '/admin/security', label: 'Security', icon: ShieldAlert }
];

export function titleFromRoute(route: string) {
  return nav.find((item) => route.startsWith(item.path))?.label ?? 'Dashboard';
}