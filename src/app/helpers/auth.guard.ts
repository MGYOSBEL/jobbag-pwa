import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from '../services/authentication.service';
import { LoggingService } from '@app/logging.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private logging: LoggingService,
    private authenticationService: AuthenticationService
) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    this.logging.log('Entering in the routing guard...');
    this.logging.log('isLoggedIn is ' + (this.authenticationService.isLoggedIn ? 'true' : 'false'));
    if (this.authenticationService.isLoggedIn) {
      this.logging.log('Exiting the routing guard with true...');
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    this.logging.log('Exiting the routing guard with false...');
    return false;
  }

}
