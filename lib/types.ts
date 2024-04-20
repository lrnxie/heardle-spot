export type TrackType = {
  id: string;
  title: string;
  artist: string;
  albumImage: string;
  url: string;
  previewUrl: string;
  displayName: string;
};

export type GuessType =
  | TrackType
  | {
      displayName: 'Skipped';
    };
