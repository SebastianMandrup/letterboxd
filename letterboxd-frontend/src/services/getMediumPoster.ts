export function getMediumPoster(originalUrl: string | null | undefined): string {
    if (!originalUrl) return './assets/placeholder-movie.png';
    return originalUrl.replace("original", "w500");
}