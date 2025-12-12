export function getThumbnailPoster(posterPath: string | null | undefined): string {
    const THUMBNAIL_SIZE = 'w185';

    if (!posterPath) return '/placeholder-movie.png';

    // Check if it's a full TMDB URL with 'original' size
    if (posterPath.includes('image.tmdb.org/t/p/original')) {
        return posterPath.replace('/t/p/original', `/t/p/${THUMBNAIL_SIZE}`);
    }

    // Check if it's any TMDB URL (with other sizes)
    if (posterPath.includes('image.tmdb.org/t/p/')) {
        // Replace any existing size with thumbnail size
        return posterPath.replace(/\/t\/p\/[^/]+/, `/t/p/${THUMBNAIL_SIZE}`);
    }

    // If it's just a path, construct full URL
    const BASE_URL = 'https://image.tmdb.org/t/p/';
    const cleanPath = posterPath.startsWith('/') ? posterPath : `/${posterPath}`;
    return `${BASE_URL}${THUMBNAIL_SIZE}${cleanPath}`;
}
