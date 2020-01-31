import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
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
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    if (this.authenticationService.isLoggedIn) {
      const userId = route.paramMap.get('id');
      return this.userService.getUser(userId).pipe(
        mergeMap(user => {
          if (user) {
            return of(user);
          } else {
            return EMPTY;
          }
        })
      );
    } else {
      return EMPTY;
    }

  }

}
