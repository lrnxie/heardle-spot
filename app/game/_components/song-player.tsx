'use client';

import { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AUDIO_PROGRESSES, MAX_AUDIO_LENGTH } from '@/lib/constants';

export default function SongPlayer({
  src,
  attempt,
}: {
  src: string;
  attempt: number;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const allowedAudioLength = AUDIO_PROGRESSES[attempt];

  return (
    <>
      <div className="relative grid h-3 w-full grid-cols-10 divide-x divide-gray-500 border border-gray-500">
        <div
          className={cn('absolute -left-px -top-px h-3 bg-emerald-600')}
          style={{
            width: `${progressPercent}%`,
            maxWidth: `${allowedAudioLength * 10}%`,
          }}
        ></div>
        {AUDIO_PROGRESSES.map((progress, index) => {
          const spanNum = progress - AUDIO_PROGRESSES[index - 1];

          return (
            <div
              key={index}
              className={cn(
                attempt >= index ? 'bg-gray-700' : 'bg-transparent'
              )}
              style={{
                gridColumn:
                  index === 0
                    ? 'span 1 / span 1'
                    : `span ${spanNum} / span ${spanNum}`,
              }}
            ></div>
          );
        })}
      </div>

      <div className="mt-2 flex items-center">
        <span className="font-medium">
          0:{currentProgress < 10 ? `0${currentProgress}` : currentProgress}
        </span>

        <div className="flex flex-1 justify-center">
          <Button
            variant="outline"
            className="size-14 rounded-full dark:border-gray-300"
            onClick={() => {
              if (isPlaying) {
                audioRef.current?.pause();
              } else {
                audioRef.current?.play();
              }

              setIsPlaying(!isPlaying);
            }}
          >
            {isPlaying ? (
              <Pause className="size-8 text-gray-200" />
            ) : (
              <Play className="size-8 text-gray-200" />
            )}
            <span className="sr-only">Toggle playing</span>
          </Button>
        </div>

        <span className="font-medium">0:10</span>

        <audio
          ref={audioRef}
          src={src}
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={() => {
            if (audioRef.current) {
              const audioCurrentTime = audioRef.current.currentTime;
              setCurrentProgress(Math.floor(audioCurrentTime));
              setProgressPercent((audioCurrentTime / MAX_AUDIO_LENGTH) * 100);

              if (
                Math.floor(audioCurrentTime) === allowedAudioLength ||
                audioCurrentTime >= MAX_AUDIO_LENGTH
              ) {
                audioRef.current.pause();
                setIsPlaying(false);
              }
            }
          }}
          onPause={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
            }
          }}
        />
      </div>
    </>
  );
}
