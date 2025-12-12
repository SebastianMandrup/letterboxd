export function getMovieBackdrop(backdropPath: string | null | undefined): string {
    const BACKDROP_SIZE = 'w1280';

    if (!backdropPath) return '/placeholder-backdrop.png';

    // If it's already a full TMDB URL with 'original', replace size
    if (backdropPath.includes('image.tmdb.org/t/p/original')) {
        return backdropPath.replace('/t/p/original', `/t/p/${BACKDROP_SIZE}`);
    }

    // If it's any TMDB URL, replace whatever size exists
    // FIXED: Removed unnecessary escape character
    if (backdropPath.includes('image.tmdb.org/t/p/')) {
        return backdropPath.replace(/\/t\/p\/[^/]+/, `/t/p/${BACKDROP_SIZE}`);
    }

    // If it's just a path, construct full URL
    const BASE_URL = 'https://image.tmdb.org/t/p/';
    const cleanPath = backdropPath.startsWith('/') ? backdropPath : `/${backdropPath}`;
    return `${BASE_URL}${BACKDROP_SIZE}${cleanPath}`;
}
