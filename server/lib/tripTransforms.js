const buildTripFallbackImages = (trip) =>
  [
    trip.image,
    trip.hero?.image,
    trip.introGallery?.bigSquare,
    trip.introGallery?.wideRect,
    trip.introGallery?.stackedTop,
    trip.introGallery?.stackedBottom,
    ...(trip.midCarousel ?? []),
  ].filter(Boolean);

export const normalizeKeyExperiences = (trip) => {
  const entries = trip.tripFacts?.keyExperiences ?? [];
  const details = trip.tripFacts?.keyExperienceDetails ?? [];
  const fallbackImages = buildTripFallbackImages(trip);

  return entries
    .map((entry, index) => {
      const title = typeof entry === 'string' ? entry : entry?.title;
      if (!title) {
        return null;
      }

      const image =
        (typeof entry === 'object' ? entry?.image : undefined) ??
        details[index]?.images?.[0] ??
        fallbackImages[index % Math.max(fallbackImages.length, 1)] ??
        trip.image;

      return { title, image };
    })
    .filter(Boolean);
};

export const normalizeTrip = (trip) => ({
  ...trip,
  tripFacts: trip.tripFacts
    ? {
        ...trip.tripFacts,
        keyExperiences: normalizeKeyExperiences(trip),
      }
    : trip.tripFacts,
});
