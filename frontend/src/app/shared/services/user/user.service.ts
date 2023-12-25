import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageService } from '../image/image.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser$ = new BehaviorSubject<User | undefined>(undefined);

  userImageUpdated$ = new BehaviorSubject<undefined>(undefined);

  constructor(
    private http: HttpClient,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
  ) {}

  getCurrentUser(): Observable<User> {
    if (this.currentUser$.getValue() === undefined) {
      return this.http
        .get<User>(`${environment.apiUrl}/api/User/currentUser`)
        .pipe(
          tap((user) => {
            this.currentUser$.next(user);
          }),
        );
    }
    return of(this.currentUser$.getValue()) as Observable<User>;
  }

  getCurrentUserImage(): Observable<SafeUrl> {
    return this.userImageUpdated$.pipe(
      switchMap(() => {
        return this.getCurrentUser().pipe(
          switchMap((user) => {
            return this.imageService.getImage(
              user.imageId,
              'https://ionicframework.com/docs/img/demos/thumbnail.svg',
            );
          }),
        );
      }),
    );
  }

  upsertUserImage(file: File): Observable<SafeUrl> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.getCurrentUser().pipe(
      switchMap((user) =>
        this.http.post(`${environment.apiUrl}/api/Image/upload`, formData, {
          params: {
            relatedObjectId: user.userId,
            relatedObjectTable: 'Users',
          },
          responseType: 'blob',
        }),
      ),
      map((blob) => {
        let objectURL = URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }),
    );
  }
}
