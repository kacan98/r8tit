export interface RatingForObjectDTO {
  ratingValue: number;
  ratingCategoryId: number;
  createdByUserId: number;
  imageId: number;
  username: string;
  categoryName: string;
  global: boolean;
}

export interface RatingForUpsert {
  relatedObjectId: number;
  ratingValue: number;
  ratingCategoryId: number;
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

export interface RatingCategoriesForObjectType {
  global: RatingCategory[];
  user: 'Not implemented yet';
  message: string;
}

export interface RatingSummary {
  ratings: RatingForObjectDTO[];
  average: number;
}
