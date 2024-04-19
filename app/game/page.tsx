'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Info, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GuessResults from './_components/guess-results';
import SongPlayer from './_components/song-player';
import { playlist } from '@/data';

const MAX_ATTEMPT = 5;
const SKIPS = [1, 2, 3, 3];
const SAMPLE_TRACK = playlist.tracks.items[0].track;

function getAnswer(track: any) {
  return {
    title: track.name,
    artist: track.artists.map((_artist: any) => _artist.name).join(', '),
    albumImage:
      track.album.images.find(
        (image: { height: number; width: number; url: string }) =>
          image.width === 300
      )?.url ?? track.album.images[0].url,
    url: track.external_urls.spotify,
    previewUrl: track.preview_url,
  };
}

export default function GamePage() {
  const [gameStatus, setGameStatus] = useState<'running' | 'won' | 'lost'>(
    'running'
  );
  const [guesses, setGuesses] = useState<string[]>([]);
  const [attempt, setAttepmt] = useState(1);
  const [tentativeGuess, setTentativeGuess] = useState('');
  const [answer, setAnswer] = useState(getAnswer(SAMPLE_TRACK));

  useEffect(() => {
    const randomNum = Math.floor(Math.random() * playlist.tracks.items.length);

    setAnswer(getAnswer(playlist.tracks.items[randomNum].track));
  }, []);

  function handleSubmitGuess(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (tentativeGuess) {
      setTentativeGuess('');

      const nextGuesses = [...guesses, tentativeGuess.toLowerCase()];
      setGuesses(nextGuesses);

      if (tentativeGuess.toLowerCase() === answer.title.toLowerCase()) {
        setGameStatus('won');
      } else if (nextGuesses.length >= MAX_ATTEMPT) {
        setGameStatus('lost');
      } else {
        setAttepmt(attempt + 1);
      }
    }
  }

  return (
    <main className="mx-auto flex h-full max-w-3xl flex-col items-center">
      {/* header */}
      <div className="flex w-full items-center border-b px-2 py-2.5">
        <Info className="size-5 text-gray-300" />
        <h1 className="flex-1 text-center text-2xl font-bold tracking-tight">
          HeardleSpot
        </h1>
        <span className="text-sm font-medium text-gray-300">Demo</span>
      </div>

      <GuessResults guesses={guesses} answer={answer} gameStatus={gameStatus} />

      <div className="flex h-full w-full flex-col justify-end p-2">
        <SongPlayer
          src={answer.previewUrl}
          attempt={gameStatus === 'running' ? guesses.length : MAX_ATTEMPT - 1}
        />

        {/* guess input */}
        <form
          className="relative mt-3 rounded"
          id="guess-form"
          onSubmit={handleSubmitGuess}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <Input
            type="text"
            name="guess"
            value={tentativeGuess}
            required
            disabled={gameStatus !== 'running'}
            placeholder="Enter your guess"
            className="py-1.5 pl-10"
            onChange={(e) => setTentativeGuess(e.target.value)}
          />
        </form>

        {/* skip & submit button */}
        <div className="mt-3 flex justify-between">
          <Button
            variant="secondary"
            disabled={gameStatus !== 'running'}
            onClick={() => {
              setGuesses([...guesses, 'Skipped']);

              if (attempt < MAX_ATTEMPT) {
                setAttepmt(attempt + 1);
              } else {
                setGameStatus('lost');
              }
            }}
          >
            Skip{attempt < MAX_ATTEMPT ? ` (+${SKIPS[attempt - 1]}s)` : null}
          </Button>

          {gameStatus === 'running' && (
            <Button type="submit" form="guess-form">
              Submit
            </Button>
          )}

          {gameStatus !== 'running' && (
            <Button
              onClick={() => {
                setAttepmt(1);
                setGuesses([]);
                setGameStatus('running');
                setTentativeGuess('');
              }}
            >
              Try again
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
