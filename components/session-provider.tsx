'use client';

import { createContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UserType } from '@/lib/types';

export const SessionContext = createContext<{
  isLoaded: boolean;
  user: UserType | null;
}>({ isLoaded: false, user: null });

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoaded(true);

      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (session) {
        setUser({
          avatar: session.user.user_metadata.avatar_url,
          name: session.user.user_metadata.full_name,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return (
    <SessionContext.Provider value={{ isLoaded, user }}>
      {children}
    </SessionContext.Provider>
  );
}
