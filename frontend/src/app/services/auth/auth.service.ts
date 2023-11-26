import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentToken$: ReplaySubject<string> = new ReplaySubject<string>();
  private currentUserId$: ReplaySubject<number> = new ReplaySubject<number>();

  constructor(private httpClient: HttpClient) {}

  getToken(): Observable<string> {
    return this.currentToken$.asObservable();
  }

  getCurrentUserId(): Observable<number> {
    return this.currentUserId$.asObservable();
  }

  logIn() {
    //TODO: Remove this user from the system
    return this.httpClient
      .post<{ token: string; userId: number }>(
        'http://localhost:5204/api/Auth/login',
        {
          email: 'testUser@test.com',
          password: 'testTest',
        },
        { headers: { skipToken: 'true' } },
      )
      .pipe(
        tap(({ token, userId }) => {
          this.currentToken$.next(token);
          this.currentUserId$.next(userId);
        }),
      );
  }
}
