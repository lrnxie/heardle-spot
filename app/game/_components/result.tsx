import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { SquareArrowOutUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrackType } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button, buttonVariants } from '@/components/ui/button';
import { DEFAULT_PLAYLIST } from '@/data';

export default function Result({
  score,
  tracks,
  isDemo,
}: {
  score: number;
  tracks: TrackType[];
  isDemo: boolean;
}) {
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreatePlaylist() {
    setIsCreating(true);
    const loadingToast = toast.loading('Creating playlist in Spotify...');

    try {
      const response = await fetch('/api/create-playlist', {
        method: 'POST',
        body: JSON.stringify({ tracks }),
      });
      const { playlistUrl, error } = await response.json();

      setIsCreating(false);
      toast.dismiss(loadingToast);

      if (!response.ok) {
        return toast.error(error);
      }

      toast.success('Playlist has been created', {
        action: (
          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants(), 'ml-auto h-6 px-2 text-xs')}
          >
            Open <SquareArrowOutUpRight className="ml-1 size-3" />
          </a>
        ),
      });
    } catch (error) {
      console.error(error);
      setIsCreating(false);
      toast.dismiss(loadingToast);
      toast.error('Internal server error');
    }
  }

  return (
    <div className="mx-auto mt-16 flex max-w-xl flex-col items-center gap-y-4 px-2 pb-4">
      <h2 className="text-gray-200">Your score is:</h2>
      <span className="text-4xl font-semibold">{score}</span>

      <p className="text-pretty text-center text-sm text-gray-200">
        Songs are selected randomly from{' '}
        {isDemo ? 'this playlist' : 'your top 100 most played songs'}
      </p>

      {isDemo ? (
        <Link href={DEFAULT_PLAYLIST.external_urls.spotify} target="_blank">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DEFAULT_PLAYLIST.images[0].url}
            alt={`Image of playlist ${DEFAULT_PLAYLIST.name}`}
            className="size-48"
          />
          <p className="mt-2 text-center text-sm text-gray-200">
            {DEFAULT_PLAYLIST.name}
          </p>
        </Link>
      ) : (
        <ScrollArea className="h-96 rounded border border-gray-500 sm:h-96">
          <ol className="">
            {tracks.map((track) => (
              <li
                key={track.id}
                className="mx-2 border-b border-gray-800 p-2 last:border-b-0"
              >
                <Link href={track.url} className="flex items-center gap-x-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={track.albumImage}
                    alt={`Album image of song ${track.title} by ${track.artist}`}
                    className="size-16"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-100">
                      {track.title}
                    </p>
                    <p className="text-xs text-gray-300">{track.artist}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </ScrollArea>
      )}

      {!isDemo && (
        <Button onClick={handleCreatePlaylist} disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create playlist'}
        </Button>
      )}

      <Link
        href="/"
        className={cn(
          buttonVariants({
            variant: isDemo ? 'default' : 'ghost',
          }),
          'mt-2'
        )}
      >
        Back to home
      </Link>
    </div>
  );
}
