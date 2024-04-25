import { createClient } from '@/lib/supabase/server';
import { TrackType } from '@/lib/types';

export async function POST(request: Request) {
  const { tracks } = await request.json();
  const supabase = createClient();

  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (!user || getUserError) {
    return Response.json({ success: false, message: 'User not found' });
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
    return Response.json({ success: false, message: 'Unauthorized' });
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

  if (!playlistData.id) {
    return Response.json({
      success: false,
      message: 'There was an error creating the playlist',
    });
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

  console.log(itemsData);

  return Response.json({ success: true, message: 'Playlist has been created' });
}
