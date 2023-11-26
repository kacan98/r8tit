import { Observable } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { Rating } from '../rating/rating.model';

export interface SupermarketComplete extends SupermarketForUpsert {
  supermarketCreatedByUserName: string;
  supermarketCreatedDate: string;
  supermarketUpdatedDate: string;
  supermarketId: number;
  active: boolean;
  imageId: number | null;

  imageURL$?: Observable<SafeUrl>;
  ratings: Rating[];
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
