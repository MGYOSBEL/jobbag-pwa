import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { LoggingService } from '@app/services/logging.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, private logging: LoggingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.logging.log('entering in the interceptor... (AuthInterceptor)');
    this.logging.log('_isLoggedIn is: ' + this.authenticationService.isLoggedIn);
    if (this.authenticationService.isLoggedIn) {
      const bearerToken = JSON.parse(localStorage.getItem('bearerToken'));
      req = req.clone({ setHeaders: { Authorization: `Bearer ${bearerToken.access_token}` } });
      this.logging.log('bearerToken in the interceptor: ' + bearerToken.access_token + ' ... (AuthInterceptor)');
    }
    this.logging.log('returning from the interceptor... (AuthInterceptor)');
    return next.handle(req);
  }
}


