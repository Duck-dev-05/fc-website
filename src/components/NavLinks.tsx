import Link from 'next/link';
import { UserGroupIcon, TrophyIcon, LifebuoyIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

export type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export const navigation: NavItem[] = [
  { name: 'About Us', href: '/about', icon: LifebuoyIcon },
  { name: 'First Team', href: '/team', icon: UserGroupIcon },
  { name: 'Matches', href: '/matches', icon: TrophyIcon },
  { name: 'Recent Matches', href: '/recent-matches', icon: TrophyIcon },
  { name: 'Gallery', href: '/gallery', icon: PhotoIcon },
];

const NavLinks = ({ onClick }: { onClick?: () => void }) => {
  const pathname = usePathname();
  return (
    <>
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`inline-flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            pathname === item.href
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          }`}
          onClick={onClick}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.name}</span>
        </Link>
      ))}
    </>
  );
};

export default NavLinks; 