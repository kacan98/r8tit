import { Observable } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { RatingForObjectDTO } from '../rating/rating.model';

export interface SupermarketComplete extends SupermarketForUpsert {
  supermarketCreatedByUserName: string;
  dateCreated: string;
  dateUpdated: string;
  supermarketId: number;
  active: boolean;
  imageId: number | null;
  averageRating: number | null;

  imageURL$?: Observable<SafeUrl | undefined>;
  ratings: RatingForObjectDTO[];
}

export interface SupermarketListDTO {
  imageId: number;
  supermarketCreatedDate: string;
  supermarketUpdatedDate: string;
  supermarketId: number;
  supermarketCreatedByUserName: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  active: boolean;
  averageRating: number;

  imageURL$?: Observable<SafeUrl | undefined>;
}

export interface SupermarketForUpsert {
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface SupermarketCreatedResponse {
  message: string;
  supermarket: SupermarketComplete;
}
