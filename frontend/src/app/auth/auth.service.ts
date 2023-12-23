import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  first,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';

interface CurrentAuth {
  token: string;
  userId: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentAuth$: BehaviorSubject<CurrentAuth | undefined>;

  constructor(
    private httpClient: HttpClient,
    private navController: NavController,
  ) {
    this.currentAuth$ = this.initCurrentUser();
  }

  canActivate(): Observable<boolean | UrlTree> {
    return this.currentAuth$.pipe(
      switchMap((currentAuth) => {
        if (!currentAuth) return this.navController.navigateRoot('/auth');
        return of(true);
      }),
    );
  }

  isSomeoneLoggedIn(): Observable<boolean> {
    return this.currentAuth$.pipe(map((user) => !!user));
  }

  getToken(): Observable<string | undefined> {
    return this.currentAuth$.pipe(map((user) => user?.token));
  }

  getCurrentUserId(): Observable<number | undefined> {
    return this.currentAuth$.pipe(
      map((user) => user?.userId),
      first(),
    );
  }

  refreshToken() {
    if (localStorage.getItem('token') === null) return EMPTY;
    return this.httpClient
      .put<{ token: string; userId: string }>(
        'http://localhost:5204/api/Auth/refreshToken',
        {},
      )
      .pipe(
        first(),
        //in case the token is outdated
        catchError(() => {
          this.currentAuth$.next(undefined);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          void this.navController.navigateRoot('/auth');
          return of(undefined);
        }),
        tap({
          next: (newAuth) => {
            if (!newAuth) return;
            localStorage.setItem('token', newAuth.token);
            localStorage.setItem('userId', newAuth.userId.toString());
            this.currentAuth$.next({
              token: newAuth.token,
              userId: +newAuth.userId,
            });
          },
        }),
      );
  }

  logIn(email: string, password: string) {
    return this.httpClient
      .post<{ token: string; userId: number }>(
        'http://localhost:5204/api/Auth/login',
        {
          email,
          password,
        },
        { headers: { skipToken: 'true' } },
      )
      .pipe(
        tap(({ token, userId }) => {
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId.toString());
          this.currentAuth$.next({ token, userId });
        }),
      );
  }

  register(
    username: string,
    email: string,
    password: string,
    passwordConfirm: string,
  ) {
    return this.httpClient.post<{ token: string; userId: number }>(
      'http://localhost:5204/api/Auth/register',
      {
        username,
        email,
        password,
        passwordConfirm,
      },
      { headers: { skipToken: 'true' } },
    );
  }

  signOut() {
    this.currentAuth$.next(undefined);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    void this.navController.navigateRoot('/auth');
  }

  private initCurrentUser(): BehaviorSubject<CurrentAuth | undefined> {
    let token = localStorage.getItem('token');
    let userId = localStorage.getItem('userId');
    if (!this.currentAuth$ && token && userId) {
      return new BehaviorSubject<CurrentAuth | undefined>({
        token,
        userId: +userId,
      });
    } else return new BehaviorSubject<CurrentAuth | undefined>(undefined);
  }
}
