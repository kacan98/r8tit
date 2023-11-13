import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import {
  SupermarketComplete,
  SupermarketForUpsert,
} from './supermarkets.model';
import { ImageService } from '../image/image.service';
import { DomSanitizer } from '@angular/platform-browser';

interface LocationData {
  latitude: number;
  longitude: number;
  type: string;
  distance: number;
  name: string;
  number: null;
  postal_code: null;
  street: null;
  confidence: number;
  region: string;
  region_code: string;
  county: string;
  locality: null;
  administrative_area: null;
  neighbourhood: null;
  country: string;
  country_code: string;
  continent: string;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupermarketService {
  constructor(
    private http: HttpClient,
    private imageService: ImageService,
    private readonly sanitizer: DomSanitizer,
  ) {}

  getAllSupermarkets(): Observable<SupermarketComplete[]> {
    return this.http
      .get<SupermarketComplete[]>(
        'http://localhost:5204/Supermarket/GetAllList',
      )
      .pipe(
        map((supermarkets) => {
          return supermarkets
            .map((supermarket) => this.addImageToSupermarket(supermarket))
            .sort((a, b) =>
              a.supermarketUpdatedDate > b.supermarketUpdatedDate ? 1 : -1,
            );
        }),
      );
  }

  getSupermarketDetails(
    supermarketId: string,
  ): Observable<SupermarketComplete> {
    return this.http
      .get<SupermarketComplete>(
        `http://localhost:5204/Supermarket/GetById/${supermarketId}`,
      )
      .pipe(map((supermarket) => this.addImageToSupermarket(supermarket)));
  }

  upsertSupermarket(supermarket: SupermarketForUpsert): Observable<any> {
    return this.http
      .put<boolean>('http://localhost:5204/Supermarket/Upsert', supermarket)
      .pipe(map((result) => result));
  }

  getLocationDetails(
    longitude: number,
    latitude: number,
  ): Observable<LocationData> {
    return this.http.get<LocationData>(
      `http://localhost:5204/Location/GetLocationDetails?longitude=${longitude}&latitude=${latitude}`,
    );
  }

  private addImageToSupermarket(
    supermarket: SupermarketComplete,
  ): SupermarketComplete {
    const imageURL$ =
      supermarket.imageId === null
        ? of('assets/placeholders/placeholder-image-dark.jpg')
        : this.imageService.getImage(supermarket.imageId).pipe(
            map((blob) => {
              let objectURL = URL.createObjectURL(blob);
              console.log(objectURL);
              return this.sanitizer.bypassSecurityTrustUrl(objectURL);
            }),
          );
    return {
      ...supermarket,
      imageURL$,
    };
  }
}
