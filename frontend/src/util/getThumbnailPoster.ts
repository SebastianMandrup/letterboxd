export function getThumbnailPoster(originalUrl: string | null | undefined): string {
    if (!originalUrl) return '/placeholder-movie.png';
    return originalUrl.replace('/t/p/original', '/t/p/w185');
}
