import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
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
  private readonly currentUser$?: BehaviorSubject<CurrentAuth | undefined>;

  constructor(
    private httpClient: HttpClient,
    private navController: NavController,
  ) {}

  isSomeoneLoggedIn(): Observable<boolean> {
    return this.getCurrentUser$().pipe(map((user) => !!user));
  }

  getToken(): Observable<string | undefined> {
    return this.getCurrentUser$().pipe(map((user) => user?.token));
  }

  getCurrentUserId(): Observable<number | undefined> {
    return this.getCurrentUser$().pipe(map((user) => user?.userId));
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
          this.getCurrentUser$().next({ token, userId });
        }),
      );
  }

  signOut() {
    this.getCurrentUser$().next(undefined);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    void this.navController.navigateRoot('/auth');
  }

  canActivate(): Observable<boolean | UrlTree> {
    return this.getCurrentUser$().pipe(
      switchMap((currentAuth) => {
        console.log('currentAuth', currentAuth);
        if (!currentAuth) return this.navController.navigateRoot('/auth');
        return of(true);
      }),
    );
  }

  private getCurrentUser$(): BehaviorSubject<CurrentAuth | undefined> {
    let currentUser$ = this.currentUser$;
    if (!currentUser$) {
      currentUser$ = this.initCurrentUser();
    }
    return currentUser$;
  }

  private initCurrentUser(): BehaviorSubject<CurrentAuth | undefined> {
    let token = localStorage.getItem('token');
    let userId = localStorage.getItem('userId');
    if (!this.currentUser$ && token && userId) {
      return new BehaviorSubject<CurrentAuth | undefined>({
        token,
        userId: +userId,
      });
    } else return new BehaviorSubject<CurrentAuth | undefined>(undefined);
  }
}
