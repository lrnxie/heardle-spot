'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { SessionContext } from '@/components/session-provider';
import { Button, buttonVariants } from '@/components/ui/button';

export default function Home() {
  const { isLoaded, user } = useContext(SessionContext);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const supabase = createClient();

  async function signInWithSpotify() {
    setIsLoggingIn(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        redirectTo: `${window.location.origin}/game`,
        scopes: 'user-top-read playlist-modify-public',
      },
    });

    if (error) {
      console.error(error);
      setIsLoggingIn(false);
    }
  }

  return (
    <main className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center">
      <div className="flex grow flex-col items-center justify-center">
        <h1 className="p-2 text-4xl font-bold tracking-tight">HeardleSpot</h1>
        <h2 className="text-pretty p-2 text-center text-sm text-gray-300">
          How well do you know your favorite songs on Spotify?
        </h2>

        <div className="mt-8 space-x-8">
          {isLoaded ? (
            user ? (
              <Link href="/game" className={buttonVariants()}>
                Start now
              </Link>
            ) : (
              <>
                <Button onClick={signInWithSpotify} disabled={isLoggingIn}>
                  {isLoggingIn ? 'Loading...' : 'Get started'}
                </Button>
                <Link
                  href="/game?demo"
                  className={buttonVariants({ variant: 'ghost' })}
                >
                  Demo game
                </Link>
              </>
            )
          ) : (
            <div className="h-10"></div>
          )}
        </div>
      </div>
    </main>
  );
}
