import { createClient } from '@/lib/supabase/server';
import { TrackType } from '@/lib/types';

export async function POST(request: Request) {
  const { tracks } = await request.json();

  if (!tracks || tracks.length === 0) {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (!user || getUserError) {
    return Response.json({ error: 'User not found' }, { status: 401 });
  }

  const {
    data: { session },
    error: getSessionError,
  } = await supabase.auth.getSession();

  if (
    !session ||
    getSessionError ||
    !session.user.identities?.some(
      (identity) => identity.provider === 'spotify'
    )
  ) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const createPlaylistResponse = await fetch(
    `https://api.spotify.com/v1/users/${session.user.identities[0].id}/playlists`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.provider_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'My Top Songs',
        description:
          'Created by HeardleSpot - https://heardle-spot.vercel.app/',
        public: true,
      }),
    }
  );
  const playlistData = await createPlaylistResponse.json();

  if (playlistData.error || !playlistData.id) {
    return Response.json(
      {
        error:
          playlistData.error.message ||
          'There was an error creating the playlist',
      },
      { status: playlistData.error.status || 400 }
    );
  }

  const addItemsResponse = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.provider_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: tracks.map((track: TrackType) => `spotify:track:${track.id}`),
      }),
    }
  );
  const itemsData = await addItemsResponse.json();

  if (itemsData.error) {
    return Response.json(
      { error: itemsData.error.message },
      { status: itemsData.error.status }
    );
  }

  return Response.json({ playlistUrl: playlistData.external_urls.spotify });
}
