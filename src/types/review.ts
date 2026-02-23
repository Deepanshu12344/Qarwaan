export type TripReview = {
  _id: string;
  authorName: string;
  rating: number;
  title?: string;
  comment: string;
  verified: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};
