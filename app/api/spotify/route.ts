import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (!user || getUserError) {
    return Response.json({ message: 'User not found' });
  }

  const {
    data: { session },
    error: getSessionError,
  } = await supabase.auth.getSession();

  if (getSessionError) {
    return Response.json({ message: 'Unauthorized' });
  }

  const spotifyResponse = await fetch(
    'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50',
    {
      headers: {
        Authorization: `Bearer ${session?.provider_token}`,
      },
    }
  );
  const spotifyData = await spotifyResponse.json();

  const spotifyResponse2 = await fetch(
    'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&offset=50&limit=50',
    {
      headers: {
        Authorization: `Bearer ${session?.provider_token}`,
      },
    }
  );
  const spotifyData2 = await spotifyResponse2.json();

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

  return Response.json(tracks);
}
