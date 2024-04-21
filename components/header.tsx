'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        'absolute left-0 right-0 top-0 mx-auto flex w-full max-w-3xl items-center justify-between px-2 py-3',
        pathname !== '/' && 'border-b border-gray-300'
      )}
    >
      <Info className="size-6 text-gray-400" />
      {pathname !== '/' && (
        <h1 className="flex-1 text-center text-2xl font-bold leading-6 tracking-tight">
          <Link href="/">HeardleSpot</Link>
        </h1>
      )}
      <div className="size-6">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
