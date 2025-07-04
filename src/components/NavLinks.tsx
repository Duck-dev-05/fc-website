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
          className={`inline-flex items-center space-x-2 px-4 py-2 text-base font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 whitespace-nowrap border-b-2 ${
            pathname === item.href
              ? 'text-blue-700 border-blue-600 bg-blue-50 shadow-sm'
              : 'text-gray-700 border-transparent hover:text-blue-600 hover:bg-blue-50 hover:border-blue-400'
          }`}
          onClick={onClick}
          style={{whiteSpace: 'nowrap'}}
        >
          <item.icon className="h-5 w-5" />
          <span className="whitespace-nowrap">{item.name}</span>
        </Link>
      ))}
    </>
  );
};

export default NavLinks; 