'use client';

import { useState } from 'react';
import { BoxSelect, Check, Info, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SongPlayer } from './_components/song-player';

const MAX_ATTEMPT = 5;
const SKIPS = [1, 2, 3, 3];
const SONG_PREVIEW_URL =
  'https://p.scdn.co/mp3-preview/dba15da5409f3c808022cf927c0ff8581f717aa4?cid=cfe923b2d660439caf2b557b21f31221';

export default function GamePage() {
  const [attempt, setAttepmt] = useState(1);

  return (
    <main className="mx-auto flex h-full max-w-3xl flex-col items-center">
      {/* header */}
      <div className="flex w-full items-center border-b px-2 py-2.5">
        <Info className="size-5 text-gray-300" />
        <h1 className="flex-1 text-center text-2xl font-bold tracking-tight">
          HeardleSpot
        </h1>
        <span className="text-sm font-medium text-gray-300">1/10</span>
      </div>

      {/* guesses */}
      <div className="my-4 w-full max-w-xl space-y-2.5 p-1.5 sm:space-y-3">
        <div className="flex h-12 w-full items-center rounded border border-gray-600 p-1.5 text-gray-500">
          <BoxSelect className="mr-2 text-gray-400/60" />
          <p className="truncate">Skipped</p>
        </div>
        <div className="flex h-12 w-full items-center rounded border border-gray-600 p-1.5 text-gray-500">
          <X className="mr-2 text-red-400/60" />
          <p className="truncate">Style - Taylor Swift</p>
        </div>
        <div className="flex h-12 w-full items-center rounded border border-gray-300 p-1.5">
          <Check className="mr-2 text-emerald-400" />
          <p className="truncate">Red - Taylor Swift</p>
        </div>
        <div className="flex h-12 w-full items-center rounded border border-gray-500 p-1.5"></div>
        <div className="flex h-12 w-full items-center rounded border border-gray-500 p-1.5"></div>
      </div>

      <div className="flex h-full w-full flex-col justify-end p-2">
        <SongPlayer src={SONG_PREVIEW_URL} attempt={attempt} />

        {/* guess input */}
        <div className="relative mt-3 rounded">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <Input
            type="text"
            name="guess"
            placeholder="Enter your guess"
            className="py-1.5 pl-10"
          />
        </div>

        {/* skip & submit button */}
        <div className="mt-3 flex justify-between">
          <Button
            variant="secondary"
            onClick={() => {
              if (attempt < MAX_ATTEMPT) {
                setAttepmt(attempt + 1);
              } else {
                console.log('end game');
                setAttepmt(1);
              }
            }}
          >
            Skip{attempt < MAX_ATTEMPT ? ` (+${SKIPS[attempt - 1]}s)` : null}
          </Button>
          <Button>Submit</Button>
        </div>
      </div>
    </main>
  );
}
