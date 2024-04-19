import { BoxSelect, Check, Info, Play, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function GamePage() {
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
        {/* song player */}
        <div className="grid h-3 w-full grid-cols-10 divide-x divide-gray-500 border border-gray-500">
          <div className="col-span-1 bg-gray-700"></div>
          <div className="col-span-1"></div>
          <div className="col-span-2"></div>
          <div className="col-span-3"></div>
          <div className="col-span-3"></div>
        </div>
        <div className="mt-2 flex items-center">
          <span className="font-medium">0:00</span>

          <div className="flex flex-1 justify-center">
            <Button
              variant="outline"
              className="size-14 rounded-full dark:border-gray-300"
            >
              <Play className="size-8 text-gray-200" />
            </Button>
          </div>

          <span className="font-medium">0:10</span>
        </div>

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
          <Button variant="secondary">Skip (+1s)</Button>
          <Button>Submit</Button>
        </div>
      </div>
    </main>
  );
}
