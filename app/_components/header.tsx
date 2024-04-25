'use client';

import { useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Info, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { SessionContext } from '@/components/session-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { isLoaded, user } = useContext(SessionContext);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error({ error });
    }

    router.push('/');
  }

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
        {isLoaded && user && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="size-6">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-2">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 size-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
