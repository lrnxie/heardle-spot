import Link from 'next/link';
import { BoxSelect, Check, X } from 'lucide-react';
import { cn, range } from '@/lib/utils';

const MAX_ATTEMPT = 5;

type AnswerType = {
  title: string;
  artist: string;
  albumImage: string;
  url: string;
  previewUrl: string;
};

export default function GuessResults({
  guesses,
  answer,
  gameStatus,
}: {
  guesses: string[];
  answer: AnswerType;
  gameStatus: 'running' | 'won' | 'lost';
}) {
  return (
    <div className="my-4 w-full max-w-xl space-y-2.5 p-1.5 sm:space-y-3">
      {range(1, MAX_ATTEMPT + 1).map((num, index) => {
        const thisGuess = guesses[index];
        const isCorrectGuess = thisGuess === answer.title.toLowerCase();

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
                ) : thisGuess === 'Skipped' ? (
                  <BoxSelect className="mr-2 text-gray-400/60" />
                ) : (
                  <X className="mr-2 text-red-400/60" />
                )}

                <p className="truncate">{thisGuess}</p>
              </>
            )}
          </div>
        );
      })}

      {gameStatus !== 'running' || guesses.length === MAX_ATTEMPT ? (
        <Link
          href={answer.url}
          target="_blank"
          className="flex w-full items-center gap-x-4 rounded border border-gray-300 p-1.5"
        >
          <img
            src={answer.albumImage}
            alt={`Album image of song ${answer.title} by ${answer.artist}`}
            className="size-24"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-100">{answer.title}</p>
            <p className="text-sm text-gray-300">{answer.artist}</p>
          </div>
        </Link>
      ) : null}
    </div>
  );
}
