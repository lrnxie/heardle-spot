import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { playlist } from '@/data';

export default function Result({ score }: { score: number }) {
  return (
    <div className="mx-auto my-6 flex max-w-xl flex-col items-center gap-y-4">
      <h2 className="text-gray-200">Your score is:</h2>
      <span className="text-4xl font-semibold">{score}</span>

      <p className="text-sm text-gray-200">
        Songs are random selected from this playlist
      </p>

      <Link href={playlist.external_urls.spotify} target="_blank">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={playlist.images[0].url}
          alt={`Image of playlist ${playlist.name}`}
          className="size-48"
        />
        <p className="mt-2 text-center text-sm text-gray-200">
          {playlist.name}
        </p>
      </Link>

      <Link href="/" className={cn(buttonVariants(), 'mt-2')}>
        Back to home
      </Link>
    </div>
  );
}
