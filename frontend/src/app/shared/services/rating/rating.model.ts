export interface Rating {
  ratingValue: number;
  ratingCategoryId: number;
  userId: number;
  imageId: number;
  username: string;
  categoryName: string;
  global: boolean;
}

export interface RatingCategory {
  ratingCategoryId: number;
  categoryName: string;
  relatedObjectTable: string;
  createdByUserId: number;
  global: boolean;
  categoryCreated: Date;
  categoryUpdated?: Date;
}

export interface RatingCategoryForObjectType {
  global: RatingCategory[];
  user: 'Not implemented yet';
  message: string;
}
