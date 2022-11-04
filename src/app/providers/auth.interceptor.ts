import { Injectable } from '@angular/core';
import { HttpHandler, HttpEvent, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        if (err.status === 401) {
            localStorage.removeItem('token');
            this.router.navigateByUrl(`/auth/login`);
            return of(err.message); // or EMPTY may be appropriate here
        }
        return throwError(err);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError(x=> this.handleAuthError(x))); //here use an arrow function, otherwise you may get "Cannot read property 'navigate' of undefined" on angular 4.4.2/net core 2/webpack 2.70
    }
}