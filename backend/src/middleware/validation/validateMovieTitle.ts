export default (title: string): string => {
  const sanitizedTitle = title?.trim();

  if (!sanitizedTitle || typeof sanitizedTitle !== 'string') {
    throw new Error('Movie title is required and must be a string.');
  }

  return sanitizedTitle
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
