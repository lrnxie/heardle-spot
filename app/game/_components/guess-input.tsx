import { Dispatch, SetStateAction, useState } from 'react';
import { CheckIcon, Search } from 'lucide-react';
import { Combobox } from '@headlessui/react';
import { cn } from '@/lib/utils';
import { GuessType, TrackType } from '@/lib/types';

export default function GuessInput({
  tentativeGuess,
  setTentativeGuess,
  gameStatus,
  guessOptions,
}: {
  tentativeGuess: GuessType | null;
  setTentativeGuess: Dispatch<SetStateAction<GuessType | null>>;
  gameStatus: 'running' | 'won' | 'lost';
  guessOptions: TrackType[];
}) {
  const [query, setQuery] = useState('');

  const filteredTracks =
    query.trim().length < 3
      ? []
      : guessOptions.filter((track) => {
          return track.displayName.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      value={tentativeGuess}
      onChange={setTentativeGuess}
      className="relative"
      disabled={gameStatus !== 'running'}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>

      <Combobox.Input
        type="text"
        name="guess"
        placeholder="Enter your guess"
        required
        className="w-full rounded border-0 bg-transparent py-2 pl-10 ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6"
        onChange={(event) => setQuery(event.target.value)}
        displayValue={(track: TrackType) => track?.displayName}
      />

      <div className="relative mt-2">
        {filteredTracks.length > 0 && (
          <Combobox.Options
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded border border-gray-500 bg-gray-950 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            style={{ bottom: 'calc(100% + 50px)' }}
          >
            {filteredTracks.map((track) => (
              <Combobox.Option
                key={track.id}
                value={track}
                className={({ active }) =>
                  cn(
                    'relative cursor-default select-none py-2 pl-3 pr-9 text-sm text-white',
                    active && 'bg-gray-800'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={cn(
                        'block truncate',
                        selected && 'font-semibold'
                      )}
                    >
                      {track.displayName}
                    </span>

                    {selected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
