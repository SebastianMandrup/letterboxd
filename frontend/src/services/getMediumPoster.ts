export function getMediumPoster(
  originalUrl: string | null | undefined,
): string {
  if (!originalUrl) return '/placeholder-movie.png';
  return originalUrl.replace('original', 'w500');
}
