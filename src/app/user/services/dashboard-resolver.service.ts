import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { UserModule } from '../user.module';
import { mergeMap } from 'rxjs/operators';
import { AuthenticationService } from '@app/auth/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardResolverService implements Resolve<User> {

  constructor(private userService: UserService,
              private authenticationService: AuthenticationService) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    if (this.authenticationService.isLoggedIn) {
    return this.userService.getUser('3').pipe(
      mergeMap(user => {
        if (user) {
          return of (user);
        } else {
          return EMPTY;
        }
      })
    );
    } else {
      return EMPTY;
    }

    }
    return ;

}
