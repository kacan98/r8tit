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
  throwError,
  timeout,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { UserService } from '../shared/services/user/user.service';

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
    private userService: UserService,
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
        `${environment.apiUrl}/api/Auth/refreshToken`,
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

  logIn(email: string, password: string): Observable<CurrentAuth> {
    let retriesCounter = 0;
    const maxRetries = 30;

    return this.httpClient
      .post<CurrentAuth>(
        `${environment.apiUrl}/api/Auth/login`,
        {
          email,
          password,
        },
        { headers: { skipToken: 'true' } },
      )
      .pipe(
        timeout(5000), // Set a timeout of 5 seconds
        catchError((error) => {
          console.log(error);
          console.log(retriesCounter, maxRetries);
          // If a timeout occurs, or any other error, decide whether to retry
          if (error.name === 'TimeoutError' && retriesCounter < maxRetries) {
            retriesCounter++;
            console.error(
              `Attempt ${retriesCounter} to log in failed. Retrying...`,
            );

            return this.logIn(email, password);
          } else if (retriesCounter >= maxRetries) {
            // If max retries have been reached, rethrow the error
            return throwError(() => new Error('Max retries reached, failing.'));
          }
          return throwError(() => error);
        }),
        tap(({ token, userId }) => {
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId.toString());
          this.currentAuth$.next({ token, userId });
          this.userService.currentUser$.next(undefined);
        }),
      );
  }

  register(
    username: string,
    email: string,
    password: string,
    passwordConfirm: string,
  ) {
    return this.httpClient.post<CurrentAuth>(
      `${environment.apiUrl}/api/Auth/register`,
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
    this.currentAuth$.next(undefined);
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
