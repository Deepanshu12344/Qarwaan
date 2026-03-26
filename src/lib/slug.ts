export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const tripSlug = (title: string, location?: string) => {
  if (location && location.toLowerCase() === title.toLowerCase()) {
    return slugify(title);
  }
  return slugify(location ? `${title}-${location}` : title);
};
