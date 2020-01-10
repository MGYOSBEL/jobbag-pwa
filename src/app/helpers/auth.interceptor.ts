import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { LoggingService } from '../logging.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, private logging: LoggingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authenticationService.isLoggedin) {
      const bearerToken = JSON.parse(localStorage.getItem('bearerToken'));
      req = req.clone({ setHeaders: { Authorization: `Bearer ${bearerToken.access_token}` } });
      this.logging.log('bearerToken in the interceptor' + bearerToken.access_token);
    }

    return next.handle(req);
  }
}


