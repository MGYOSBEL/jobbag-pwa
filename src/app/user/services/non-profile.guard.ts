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
    private userService: UserService,
    private router: Router) {
      this.userService.loggedUser$.subscribe(
        user => this.loggedUser = user
      );
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!!this.loggedUser && this.loggedUser.profiles.length > 0) {
      return true;
    }
    // not logged in so redirect to login page with the return url
    const role = route.params.role;
    const id = route.params.id;
    console.log('NonProfileGuard role: ', role);
    console.log('NonProfileGuard id: ', id);
    this.router.navigate([`/user/${id}/${role}/create-profile`]);
    return false;  }
}
