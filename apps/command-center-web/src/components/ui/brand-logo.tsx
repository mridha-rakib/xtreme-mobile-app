import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface BrandLogoProps {
  className?: string;
  variant?: 'sidebar-dark' | 'light';
  width?: number;
  height?: number;
}

export function BrandLogo({ className, width = 208, height = 88 }: BrandLogoProps) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-[10px]',
        className,
      )}
      style={{ width, height }}
    >
      <Image
        src="/branding/logo-sidebar-dark.png"
        alt="XTREME Concierge"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  );
}
