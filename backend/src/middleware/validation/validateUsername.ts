export default (username: string): string => {
  const sanitizedUsername = username?.trim();

  if (!sanitizedUsername || typeof sanitizedUsername !== 'string') {
    throw new Error('Username is required and must be a string.');
  }

  if (sanitizedUsername.length < 3) {
    throw new Error('Username must be at least 3 characters long.');
  }

  if (sanitizedUsername.length > 30) {
    throw new Error('Username must be less than 30 characters long.');
  }

  return sanitizedUsername;
};
