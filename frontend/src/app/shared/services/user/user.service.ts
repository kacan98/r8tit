import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import {
  BehaviorSubject,
  delayWhen,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { ImageUpsertedResponse } from '../image/image.model';
import { ImageService } from '../image/image.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser$ = new BehaviorSubject<User | undefined>(undefined);

  constructor(
    private http: HttpClient,
    private imageService: ImageService,
  ) {}

  getCurrentUser(): Observable<User> {
    if (this.currentUser$.getValue() === undefined) {
      return this.http
        .get<User>('http://localhost:5204/api/User/currentUser')
        .pipe(
          tap((user) => {
            this.currentUser$.next(user);
          }),
        );
    }
    return of(this.currentUser$.getValue()) as Observable<User>;
  }

  getCurrentUserImage(): Observable<SafeUrl> {
    return this.getCurrentUser().pipe(
      switchMap((user) => {
        return this.imageService.getImage(
          user.imageId,
          'https://ionicframework.com/docs/img/demos/thumbnail.svg',
        );
      }),
    );
  }

  upsertUserImage(file: File): Observable<SafeUrl> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.getCurrentUser()
      .pipe(
        switchMap((user) => {
          return this.http.post<ImageUpsertedResponse>(
            'http://localhost:5204/api/Image/upload',
            formData,
            {
              params: {
                relatedObjectId: user.userId,
                relatedObjectTable: 'Users',
              },
            },
          );
        }),
        delayWhen((response) => {
          return this.getCurrentUser().pipe(
            tap((user) => {
              this.currentUser$.next({
                ...user,
                imageId: response.image.imageId,
              });
            }),
          );
        }),
      )
      .pipe(
        map((response) => {
          return response.image.imageData;
        }),
        map((imageData) => this.imageService.convertToBlob(imageData)),
        map((blob) => URL.createObjectURL(blob)),
      );
  }
}
