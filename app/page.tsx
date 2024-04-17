import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-y-8">
      <h1 className="text-4xl font-bold">Spotify Quiz</h1>

      {/* TODO: instructions */}

      <div className="space-x-8">
        <Button>Log in</Button>
        <Button variant="ghost">Demo</Button>
      </div>
    </main>
  );
}
