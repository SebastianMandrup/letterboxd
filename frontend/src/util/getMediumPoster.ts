export function getMediumPoster(posterPath: string | null | undefined): string {
    const BASE_URL = 'https://image.tmdb.org/t/p/';
    const MEDIUM_SIZE = 'w500';

    if (!posterPath) return '/placeholder-movie.png';

    // If it's already a full URL with 'original', replace it
    if (posterPath.includes('image.tmdb.org') && posterPath.includes('/original/')) {
        return posterPath.replace('/original/', `/${MEDIUM_SIZE}/`);
    }

    // If it's a full URL but not from TMDB, return as-is (or could handle differently)
    if (posterPath.startsWith('http')) {
        return posterPath;
    }

    // If it's a TMDB path (starts with '/'), construct full URL
    return `${BASE_URL}${MEDIUM_SIZE}${posterPath}`;
}
