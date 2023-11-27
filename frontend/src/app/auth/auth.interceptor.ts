import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (req.headers.has('skipToken')) {
      return next.handle(req);
    }

    return this.authService.getToken().pipe(
      switchMap((token) => {
        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        });

        return next.handle(authReq);
      }),
    );
  }
}
