import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface NavigationItemProps {
  label: string;
  path: string;
  iconName: string;
  badgeCount?: number;
  className?: string;
}

export function NavigationItem({
  label,
  path,
  iconName,
  badgeCount,
  className,
}: NavigationItemProps) {
  const pathname = usePathname();
  const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));

  // Dynamically resolve icon from Lucide
  const IconComponent = ((Icons as unknown as Record<string, LucideIcon>)[iconName] ||
    Icons.Circle) as LucideIcon;

  return (
    <Link
      href={path}
      className={cn(
        'group flex h-[36px] w-[208px] items-center rounded-[8px] px-3 transition-colors text-[13px] font-semibold tracking-[0.15px]',
        isActive
          ? 'bg-[var(--color-brand-graphite,#24272D)] text-white'
          : 'text-white/80 hover:bg-[#17191D] hover:text-white',
        className,
      )}
    >
      <IconComponent className="mr-3 size-[18px] shrink-0 text-white" />
      <span className="truncate flex-1">{label}</span>
      {typeof badgeCount === 'number' && badgeCount > 0 && (
        <span className="ml-auto flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[var(--color-accent-atlantic,#164D53)] px-1.5 text-[11px] font-bold text-white">
          {badgeCount}
        </span>
      )}
    </Link>
  );
}
