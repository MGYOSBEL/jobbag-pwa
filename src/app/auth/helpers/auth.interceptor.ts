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
      if (req.url.includes(environment.apiBaseURL)) {
      const bearerToken = this.authenticationService.getToken();
      req = req.clone({ setHeaders: { Authorization: `Bearer ${bearerToken}` } });
    }
      return next.handle(req);
  }
}


