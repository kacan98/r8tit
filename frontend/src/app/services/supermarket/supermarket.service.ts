import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import {
  SupermarketComplete,
  SupermarketForUpsert,
} from './supermarkets.model';
import { ImageService } from '../image/image.service';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SupermarketService {
  allSupermarkets$: BehaviorSubject<SupermarketComplete[] | undefined> =
    new BehaviorSubject<SupermarketComplete[] | undefined>(undefined);

  constructor(
    private http: HttpClient,
    private imageService: ImageService,
    private readonly sanitizer: DomSanitizer,
  ) {}

  getAllSupermarkets(): Observable<SupermarketComplete[]> {
    return this.allSupermarkets$.pipe(
      switchMap((supermarkets) => {
        if (supermarkets === undefined) {
          return this.fetchAllSupermarkets().pipe(
            tap((supermarkets) => {
              this.allSupermarkets$.next(supermarkets);
            }),
          );
        }
        return of(supermarkets);
      }),
      shareReplay(),
    );
  }

  fetchAllSupermarkets(): Observable<SupermarketComplete[]> {
    return this.http
      .get<SupermarketComplete[]>(
        'http://localhost:5204/Supermarket/GetAllList',
      )
      .pipe(
        map((supermarkets) => {
          return supermarkets
            .map((supermarket) => this.attachImageToSupermarket(supermarket))
            .sort((a, b) =>
              a.supermarketUpdatedDate > b.supermarketUpdatedDate ? 1 : -1,
            );
        }),
      );
  }

  getSupermarketDetails(
    supermarketId: number,
  ): Observable<SupermarketComplete> {
    return this.http
      .get<SupermarketComplete>(
        `http://localhost:5204/Supermarket/GetById/${supermarketId}`,
      )
      .pipe(map((supermarket) => this.attachImageToSupermarket(supermarket)));
  }

  upsertSupermarket(supermarket: SupermarketForUpsert): Observable<any> {
    return this.http
      .put<boolean>('http://localhost:5204/Supermarket/Upsert', supermarket)
      .pipe(map((result) => result));
  }

  updateImage(supermarket: SupermarketComplete, file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http
      .post('http://localhost:5204/api/Image/upload', formData, {
        params: {
          relatedObjectId: supermarket.supermarketId,
          relatedObjectTable: 'Supermarkets',
        },
      })
      .pipe(
        map((result) => {
          return result;
        }),
      );
  }

  private attachImageToSupermarket(
    supermarket: SupermarketComplete,
  ): SupermarketComplete {
    const imageURL$ =
      supermarket.imageId === null
        ? of('assets/placeholders/placeholder-image-dark.jpg')
        : this.imageService.getImage(supermarket.imageId).pipe(
            map((blob) => {
              let objectURL = URL.createObjectURL(blob);
              return this.sanitizer.bypassSecurityTrustUrl(objectURL);
            }),
          );
    return {
      ...supermarket,
      imageURL$,
    };
  }
}
