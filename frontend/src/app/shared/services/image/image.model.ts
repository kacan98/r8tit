export interface ImageUpsertedResponse {
  message: string;
  image: Image;
}

export interface Image {
  imageId: number;
  imageCreatedByUserId: string;
  relatedObjectId: number;
  relatedObjectTable: string;
  imageData: string;
  createdDate: string;
}
