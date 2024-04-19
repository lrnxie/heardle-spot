import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';

export default function Home() {
  return (
    <>
      <main className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center">
        <div className="flex grow flex-col items-center justify-center">
          <h1 className="p-2 text-4xl font-bold tracking-tight">HeardleSpot</h1>
          <h2 className="p-2 text-center font-medium text-gray-200">
            How well do you know your favorite songs on Spotify?
          </h2>

          <div className="mt-8 space-x-8">
            <Button>Get started</Button>
            <Link href="/game" className={buttonVariants({ variant: 'ghost' })}>
              Demo game
            </Link>
          </div>
        </div>

        <footer className="py-4 text-xs text-gray-400">
          Made with 💚 by{' '}
          <a
            href="https://lrnxie.com"
            className="underline-offset-4 hover:underline"
          >
            Lauren Xie
          </a>
        </footer>
      </main>
    </>
  );
}
