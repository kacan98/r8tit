import {Injectable} from '@angular/core';
import {map, Observable, ReplaySubject, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentToken$: ReplaySubject<string> = new ReplaySubject<string>()

  constructor(private httpClient: HttpClient) {
  }

  getToken():Observable<string> {
    return this.currentToken$.pipe()
  }

  logIn(): Observable<string> {
    //TODO: Remove this user from the system
    return this.httpClient
      .post<{ token: string }>('http://localhost:5204/api/Auth/login', {
        email: 'testUser@test.com',
        password: 'testTest',
      }, {headers: { skipToken: 'true' }}).pipe(map((data) => data.token),
        tap((token) => {
          this.currentToken$.next(token);
        }))
  }
}
