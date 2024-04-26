import { createClient } from '@/lib/supabase/server';

export async function GET() {
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

  if (!session || getSessionError) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
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
    return Response.json(
      { error: spotifyData2.error.message },
      { status: spotifyData2.error.status }
    );
  }

  const allData = spotifyData.items.concat(spotifyData2.items);

  const tracks = allData.map((item: any) => {
    return {
      id: item.id,
      title: item.name,
      artist: item.artists.map((_artist: any) => _artist.name).join(', '),
      albumImage:
        item.album.images.find((image: any) => image.width === 300)?.url ??
        item.album.images[0].url,
      url: item.external_urls.spotify,
      previewUrl: item.preview_url,
      displayName: `${item.name} - ${item.artists.map((_artist: any) => _artist.name).join(', ')}`,
    };
  });

  return Response.json({ tracks });
}
