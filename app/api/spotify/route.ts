import { createClient } from '@/lib/supabase/server';
import { TOTAL_QUESTIONS } from '@/lib/constants';

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (!user || getUserError) {
    getUserError && console.error({ getUserError });
    return Response.json({ error: 'User not found' }, { status: 401 });
  }

  const {
    data: { session },
    error: getSessionError,
  } = await supabase.auth.getSession();

  if (!session || getSessionError || !session.provider_token) {
    getSessionError && console.error({ getSessionError });
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const spotifyResponse = await fetch(
    'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50',
    {
      headers: {
        Authorization: `Bearer ${session.provider_token}`,
      },
    }
  );
  const spotifyData = await spotifyResponse.json();

  if (spotifyData.error) {
    console.error('Error fetching Spotify data', spotifyData);
    return Response.json(
      { error: spotifyData.error.message },
      { status: spotifyData.error.status }
    );
  }

  const spotifyResponse2 = await fetch(
    'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&offset=50&limit=50',
    {
      headers: {
        Authorization: `Bearer ${session.provider_token}`,
      },
    }
  );
  const spotifyData2 = await spotifyResponse2.json();

  if (spotifyData2.error) {
    console.error('Error fetching Spotify data', spotifyData2);
    return Response.json(
      { error: spotifyData2.error.message },
      { status: spotifyData2.error.status }
    );
  }

  const allData = spotifyData.items.concat(spotifyData2.items);

  if (allData.length < TOTAL_QUESTIONS) {
    console.error('Insufficient data');
    return Response.json({ error: 'Insufficient data' }, { status: 400 });
  }

  const tracks = allData.map((item: any) => {
    return {
      id: item.id,
      title: item.name,
      artist: item.artists.map((_artist: any) => _artist.name).join(', '),
      albumImage:
        item.album.images.find((image: any) => image.width === 300)?.url ||
        item.album.images[0].url,
      url: item.external_urls.spotify,
      previewUrl: item.preview_url,
      displayName: `${item.name} - ${item.artists.map((_artist: any) => _artist.name).join(', ')}`,
    };
  });

  return Response.json({ tracks });
}
