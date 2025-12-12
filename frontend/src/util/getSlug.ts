export function getSlug(input: string): string {
    return input
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}
