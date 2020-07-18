import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { LoggingService } from '@app/services/logging.service';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, private logger: LoggingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes(environment.apiBaseURL)) {
      if (this.authenticationService.isLoggedIn) {
        const bearerToken = this.authenticationService.getToken();
        req = req.clone({ setHeaders: { Authorization: `Bearer ${bearerToken}` } });
      } else {
        this.authenticationService.signOut();
        return EMPTY;
      }
    }
    return next.handle(req);
  }
}


