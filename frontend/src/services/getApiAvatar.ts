export function getApiAvatar(username: string | null | undefined): string {
  if (!username)
    return 'https://ui-avatars.com/api/?name=muo&background=random';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`;
}
