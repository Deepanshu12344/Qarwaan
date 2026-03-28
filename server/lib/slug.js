export const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export const tripSlug = (title, location) => {
  if (!location) {
    return slugify(title);
  }
  if (title.toLowerCase() === location.toLowerCase()) {
    return slugify(title);
  }
  return slugify(`${title}-${location}`);
};
