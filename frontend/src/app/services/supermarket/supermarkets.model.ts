import { Observable } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';

export interface SupermarketComplete extends SupermarketForUpsert {
  supermarketCreatedByUserName: string;
  supermarketCreatedDate: string;
  supermarketUpdatedDate: string;
  supermarketId: number;
  active: boolean;
  imageId: number | null;

  imageURL$?: Observable<SafeUrl>;
}

export interface SupermarketForUpsert {
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}
