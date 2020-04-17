import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { UserCacheService } from './user-cache.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class NonProfileGuard implements CanActivate {

  loggedUser: User;

  constructor(
    private userCacheService: UserCacheService,
    private router: Router) {
      this.loggedUser = this.userCacheService.getUser();
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.loggedUser.profiles.length) {
      return true;
    }
    // not logged in so redirect to login page with the return url
    const role = route.params.role;
    console.log('NonProfileGuard role: ', role);
    this.router.navigate([`/user/${this.loggedUser.id}/${role}/create-profile`]);
    return false;  }
}

