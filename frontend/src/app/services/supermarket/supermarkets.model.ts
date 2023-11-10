import {Observable} from "rxjs";
import {SafeUrl} from "@angular/platform-browser";

export interface Supermarket {
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  supermarketCreatedByUserName: string;
  supermarketCreatedDate: string;
  supermarketUpdatedDate: string;
  supermarketId: number;
  active: boolean;
  imageId: string;

  imageURL$: Observable<SafeUrl>;
}
