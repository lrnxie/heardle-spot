import Link from 'next/link';
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import { Button, buttonVariants } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center">
      <div className="flex grow flex-col items-center justify-center">
        <h1 className="p-2 text-4xl font-bold tracking-tight">HeardleSpot</h1>
        <h2 className="p-2 text-center font-medium text-gray-300">
          How well do you know your favorite songs on Spotify?
        </h2>

        <div className="mt-8 space-x-8">
          <ClerkLoading>
            <div className="h-10"></div>
          </ClerkLoading>
          <ClerkLoaded>
            <SignedOut>
              <SignInButton mode="modal">
                <Button>Get started</Button>
              </SignInButton>
              <Link
                href="/game"
                className={buttonVariants({ variant: 'ghost' })}
              >
                Demo game
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/game" className={buttonVariants()}>
                Start now
              </Link>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </div>
    </main>
  );
}
