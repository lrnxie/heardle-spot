'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GuessResults from './_components/guess-results';
import GuessInput from './_components/guess-input';
import SongPlayer from './_components/song-player';
import { tracks } from '@/data';
import { MAX_ATTEMPT, SKIP_STEPS } from '@/lib/constants';
import { GuessType } from '@/lib/types';

const SAMPLE_TRACK = tracks[0];

export default function GamePage() {
  const [gameStatus, setGameStatus] = useState<'running' | 'won' | 'lost'>(
    'running'
  );
  const [guesses, setGuesses] = useState<GuessType[]>([]);
  const [attempt, setAttepmt] = useState(1);
  const [tentativeGuess, setTentativeGuess] = useState<GuessType | null>(null);
  const [answer, setAnswer] = useState(SAMPLE_TRACK);

  useEffect(() => {
    setAnswer(tracks[Math.floor(Math.random() * tracks.length)]);
  }, []);

  function handleSubmitGuess(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!!tentativeGuess) {
      setTentativeGuess(null);

      const nextGuesses = [...guesses, tentativeGuess];
      setGuesses(nextGuesses);

      if (tentativeGuess.displayName === answer.displayName) {
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

        <form
          className="mt-3 rounded"
          id="guess-form"
          onSubmit={handleSubmitGuess}
        >
          <GuessInput
            tentativeGuess={tentativeGuess}
            setTentativeGuess={setTentativeGuess}
            gameStatus={gameStatus}
          />
        </form>

        <div className="mt-3 flex justify-between">
          <Button
            variant="secondary"
            disabled={gameStatus !== 'running'}
            onClick={() => {
              setGuesses([...guesses, { displayName: 'Skipped' }]);

              if (attempt < MAX_ATTEMPT) {
                setAttepmt(attempt + 1);
              } else {
                setGameStatus('lost');
              }
            }}
          >
            Skip
            {attempt < MAX_ATTEMPT ? ` (+${SKIP_STEPS[attempt - 1]}s)` : null}
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
                setTentativeGuess(null);
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
