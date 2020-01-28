import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { LoggingService } from '@app/services/logging.service';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, private logging: LoggingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this.logging.log('req.url:' + req.url);
      this.logging.log('apiBaseURL:' + environment.apiBaseURL);

      if (req.url.includes(environment.apiBaseURL)) {
      const OAuth2Response = localStorage.getItem('bearerToken');
      const bearerToken = JSON.parse(JSON.parse(OAuth2Response).content).access_token;
      req = req.clone({ setHeaders: { Authorization: `Bearer ${bearerToken}` } });
      this.logging.log('OAuth2 Response: ' + OAuth2Response);
      this.logging.log('bearerToken ' + JSON.stringify(bearerToken));
    }
      return next.handle(req);
  }
}


