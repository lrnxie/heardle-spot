'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import GuessResults from './_components/guess-results';
import GuessInput from './_components/guess-input';
import SongPlayer from './_components/song-player';
import Result from './_components/result';
import { cn } from '@/lib/utils';
import { MAX_ATTEMPT, SKIP_STEPS, TOTAL_QUESTIONS } from '@/lib/constants';
import { GuessType } from '@/lib/types';
import { tracks } from '@/data';

const SAMPLE_TRACK = tracks[0];

export default function GamePage() {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
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
      {currentQuestion < TOTAL_QUESTIONS ? (
        <>
          <GuessResults
            guesses={guesses}
            answer={answer}
            gameStatus={gameStatus}
          />

          <div className="flex h-full w-full flex-col justify-end p-2">
            <SongPlayer
              src={answer.previewUrl}
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
                    setAnswer(
                      tracks[Math.floor(Math.random() * tracks.length)]
                    );
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
        <Result score={score} />
      )}
    </main>
  );
}
