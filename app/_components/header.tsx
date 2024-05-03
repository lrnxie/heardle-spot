'use client';

import { useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Info, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { SessionContext } from '@/components/session-provider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
      <Dialog>
        <DialogTrigger>
          <Info className="size-6 text-gray-400" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-2">About</DialogTitle>
          </DialogHeader>

          <div className="text-pretty text-sm dark:text-gray-300">
            HeardleSpot is a personalized song guessing game based on your
            Spotify listening history. Inspired by Heardle (RIP). Open source on{' '}
            <a
              href="https://github.com/lrnxie/heardle-spot"
              target="_blank"
              className="underline decoration-gray-400 decoration-1 underline-offset-4 hover:decoration-2"
            >
              GitHub
            </a>
            . Feel free to{' '}
            <a
              href="mailto:hello@lrnxie.com"
              className="underline decoration-gray-400 decoration-1 underline-offset-4 hover:decoration-2"
            >
              reach out
            </a>{' '}
            if you have any feedback.
          </div>
          <div className="text-pretty text-sm dark:text-gray-300">
            Made with 💚 by{' '}
            <a
              href="https://lrnxie.com"
              target="_blank"
              className="underline decoration-gray-400 decoration-1 underline-offset-4 hover:decoration-2"
            >
              Lauren Xie
            </a>
          </div>
        </DialogContent>
      </Dialog>

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
