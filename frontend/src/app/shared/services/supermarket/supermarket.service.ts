import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import {
  SupermarketComplete,
  SupermarketCreatedResponse,
  SupermarketForUpsert,
} from './supermarkets.model';
import { ImageService } from '../image/image.service';

@Injectable({
  providedIn: 'root',
})
export class SupermarketService {
  somethingChanged$ = new BehaviorSubject<undefined>(undefined);

  constructor(
    private http: HttpClient,
    private imageService: ImageService,
  ) {}

  getAllSupermarkets(): Observable<SupermarketComplete[]> {
    return this.somethingChanged$.pipe(
      switchMap(() => {
        return this.http.get<SupermarketComplete[]>(
          'http://localhost:5204/api/Supermarket/GetAllList',
        );
      }),

      map((supermarkets) => {
        return supermarkets.map((supermarket) => ({
          ...supermarket,
          imageURL$: this.imageService.getImage(
            supermarket.imageId,
            'assets/placeholders/placeholder-image-dark.jpg',
          ),
        }));
      }),
    );
  }

  refreshSupermarkets(): void {
    this.somethingChanged$.next(undefined);
  }

  getSupermarketDetails(
    supermarketId: number,
  ): Observable<SupermarketComplete> {
    return this.http.get<SupermarketComplete>(
      `http://localhost:5204/api/Supermarket/GetById/${supermarketId}`,
    );
  }

  upsertSupermarket(
    supermarket: SupermarketForUpsert,
  ): Observable<SupermarketCreatedResponse> {
    return this.http
      .put<SupermarketCreatedResponse>(
        'http://localhost:5204/api/Supermarket/Upsert',
        supermarket,
      )
      .pipe(map((result) => result));
  }

  updateImage(supermarket: SupermarketComplete, file: File): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post('http://localhost:5204/api/Image/upload', formData, {
      params: {
        relatedObjectId: supermarket.supermarketId,
        relatedObjectTable: 'Supermarkets',
      },
      responseType: 'blob',
    });
  }
}
