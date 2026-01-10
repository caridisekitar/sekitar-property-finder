type KostImage = {
  image_url: string;
  is_video_poster: boolean;
};

export function getVideoPoster(images?: KostImage[]): string {
  if (!images || images.length === 0) return "";

  const poster = images.find(img => img.is_video_poster === true);

  return poster?.image_url ?? "";
}

export function getImageCover(images?: KostImage[]): string {
  if (!images || images.length === 0) return "";

  const poster = images.find(img => img.is_video_poster === true);

  return poster?.image_url ?? "";
}
