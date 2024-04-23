import Link from 'next/link';
import { BoxSelect, Check, X } from 'lucide-react';
import { cn, range } from '@/lib/utils';
import { MAX_ATTEMPT } from '@/lib/constants';
import { GuessType, TrackType } from '@/lib/types';

export default function GuessResults({
  guesses,
  answers,
  gameStatus,
  currentQuestion,
}: {
  guesses: GuessType[];
  answers: TrackType[];
  gameStatus: 'running' | 'won' | 'lost';
  currentQuestion: number;
}) {
  return (
    <div className="mb-4 mt-16 w-full max-w-xl space-y-2.5 p-1.5 sm:space-y-3">
      {range(1, MAX_ATTEMPT + 1).map((num, index) => {
        const thisGuess = guesses[index];
        const isCorrectGuess =
          thisGuess?.displayName === answers[currentQuestion].displayName;

        return (
          <div
            key={num}
            className={cn(
              'flex h-12 w-full items-center rounded border p-1.5',
              (index === guesses.length && gameStatus === 'running') ||
                isCorrectGuess
                ? 'border-gray-300'
                : index < guesses.length
                  ? 'border-gray-600 text-gray-500'
                  : 'border-gray-500'
            )}
          >
            {index < guesses.length && (
              <>
                {isCorrectGuess ? (
                  <Check className="mr-2 text-emerald-400" />
                ) : thisGuess.displayName === 'Skipped' ? (
                  <BoxSelect className="mr-2 text-gray-400/60" />
                ) : (
                  <X className="mr-2 text-red-400/60" />
                )}

                <p className="truncate">{thisGuess.displayName}</p>
              </>
            )}
          </div>
        );
      })}

      {gameStatus !== 'running' || guesses.length === MAX_ATTEMPT ? (
        <Link
          href={answers[currentQuestion].url}
          target="_blank"
          className="flex w-full items-center gap-x-4 rounded border border-gray-300 p-1.5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={answers[currentQuestion].albumImage}
            alt={`Album image of song ${answers[currentQuestion].title} by ${answers[currentQuestion].artist}`}
            className="size-24"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-100">
              {answers[currentQuestion].title}
            </p>
            <p className="text-sm text-gray-300">
              {answers[currentQuestion].artist}
            </p>
          </div>
        </Link>
      ) : null}
    </div>
  );
}
