import { auth, clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return Response.json({ message: 'User not found' });
  }

  const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
    userId,
    'oauth_spotify'
  );

  const spotifyResponse = await fetch(
    'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50',
    {
      headers: {
        // @ts-ignore: Clerk response type bug
        Authorization: `Bearer ${clerkResponse[0].token}`,
      },
    }
  );
  const spotifyData = await spotifyResponse.json();

  const spotifyResponse2 = await fetch(
    'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&offset=50&limit=50',
    {
      headers: {
        // @ts-ignore: Clerk response type bug
        Authorization: `Bearer ${clerkResponse[0].token}`,
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
