'use client';

import { FormEvent, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import { cn, randomPick } from '@/lib/utils';
import { MAX_ATTEMPT, SKIP_STEPS, TOTAL_QUESTIONS } from '@/lib/constants';
import { GuessType, TrackType } from '@/lib/types';
import { SessionContext } from '@/components/session-provider';
import { Button } from '@/components/ui/button';
import GuessResults from './_components/guess-results';
import GuessInput from './_components/guess-input';
import SongPlayer from './_components/song-player';
import Result from './_components/result';
import { DEFAULT_TRACKS } from '@/data';

export default function GamePage() {
  const { isLoaded } = useContext(SessionContext);

  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameStatus, setGameStatus] = useState<'running' | 'won' | 'lost'>(
    'running'
  );
  const [guesses, setGuesses] = useState<GuessType[]>([]);
  const [attempt, setAttepmt] = useState(1);
  const [tentativeGuess, setTentativeGuess] = useState<GuessType | null>(null);
  const [answers, setAnswers] = useState<TrackType[]>([]);
  const [avilableTracks, setAvilableTracks] = useState(DEFAULT_TRACKS);
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    async function fetchSongs() {
      const loadingToast = toast.loading('Loading songs from Spotify...');

      try {
        const response = await fetch('/api/spotify');
        const { tracks, error } = await response.json();

        toast.dismiss(loadingToast);

        if (!response.ok) {
          if (response.status === 401) {
            toast.info('You&apos;re not logged in. Running demo game.', {
              duration: 2000,
            });
          } else {
            toast.error(`${error}. Running demo game instead.`);
          }
        }

        setAvilableTracks(tracks || DEFAULT_TRACKS);
        setAnswers(randomPick(tracks || DEFAULT_TRACKS, TOTAL_QUESTIONS));
        setIsDemo(!response.ok);
      } catch (error) {
        console.error(error);
        setAnswers(randomPick(DEFAULT_TRACKS, TOTAL_QUESTIONS));
        toast.dismiss(loadingToast);
        toast.error('Internal server error. Running demo game instead.');
      }
    }

    if (isLoaded) {
      fetchSongs();
    }
  }, [isLoaded]);

  function handleSubmitGuess(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!!tentativeGuess) {
      setTentativeGuess(null);

      const nextGuesses = [...guesses, tentativeGuess];
      setGuesses(nextGuesses);

      if (tentativeGuess.displayName === answers[currentQuestion].displayName) {
        setGameStatus('won');
        setScore(score + 10 - 2 * (attempt - 1));
      } else if (nextGuesses.length >= MAX_ATTEMPT) {
        setGameStatus('lost');
      } else {
        setAttepmt(attempt + 1);
      }
    }
  }

  return (
    <main className="mx-auto flex h-full max-w-3xl flex-col items-center">
      {answers.length === 0 ? (
        <div className="mb-4 mt-24">
          <LoaderCircle className="size-10 animate-spin text-gray-300" />
        </div>
      ) : currentQuestion < TOTAL_QUESTIONS ? (
        <>
          <GuessResults
            guesses={guesses}
            answers={answers}
            gameStatus={gameStatus}
            currentQuestion={currentQuestion}
          />

          <div className="flex h-full w-full flex-col justify-end p-2">
            <SongPlayer
              src={answers[currentQuestion].previewUrl}
              attempt={
                gameStatus === 'running' ? guesses.length : MAX_ATTEMPT - 1
              }
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
                guessOptions={avilableTracks}
              />
            </form>

            <div
              className={cn(
                'mt-3 flex',
                gameStatus === 'running' ? 'justify-between' : 'justify-end'
              )}
            >
              {gameStatus === 'running' ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setGuesses([...guesses, { displayName: 'Skipped' }]);
                      setTentativeGuess(null);

                      if (attempt < MAX_ATTEMPT) {
                        setAttepmt(attempt + 1);
                      } else {
                        setGameStatus('lost');
                      }
                    }}
                  >
                    Skip
                    {attempt < MAX_ATTEMPT
                      ? ` (+${SKIP_STEPS[attempt - 1]}s)`
                      : null}
                  </Button>

                  <Button type="submit" form="guess-form">
                    Submit
                  </Button>
                </>
              ) : null}

              {gameStatus !== 'running' ? (
                <Button
                  onClick={() => {
                    setAttepmt(1);
                    setGuesses([]);
                    setGameStatus('running');
                    setTentativeGuess(null);
                    setCurrentQuestion(currentQuestion + 1);
                  }}
                >
                  {currentQuestion === TOTAL_QUESTIONS - 1 ? 'Result' : 'Next'}
                </Button>
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <Result score={score} tracks={avilableTracks} isDemo={isDemo} />
      )}
    </main>
  );
}
