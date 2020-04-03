import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { UserModule } from '../user.module';
import { mergeMap, tap } from 'rxjs/operators';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { ScholarshipService } from './scholarship.service';
import { ProfessionService } from './profession.service';
import { ActiveProfileService } from './active-profile.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardResolverService implements Resolve<User> {

  constructor(private userService: UserService,
              private scholarshipService: ScholarshipService,
              private professionService: ProfessionService,
              private authenticationService: AuthenticationService,
              private activeProfileService: ActiveProfileService,
              private route: ActivatedRoute) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    if (this.authenticationService.isLoggedIn) {
      const userId = route.paramMap.get('id');
      return this.userService.get(userId).pipe(
        mergeMap(user => {
          if (user) {
            return of(user);
          } else {
            return EMPTY;
          }
        }),
        tap(() => {
          this.scholarshipService.getAll(true).subscribe();
          this.professionService.getAll(true).subscribe();
          this.activeProfileService.activateServiceProvider();
        })
      );
    } else {
      return EMPTY;
    }

  }

}
