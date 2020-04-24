import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Observable, of, EMPTY, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { UserModule } from '../user.module';
import { mergeMap, tap, catchError } from 'rxjs/operators';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { ScholarshipService } from './scholarship.service';
import { ProfessionService } from './profession.service';
import { LoadingService } from '@app/services/loading.service';
import { MessagesService } from '@app/services/messages.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardResolverService implements Resolve<User> {

  constructor(
    private userService: UserService,
    private scholarshipService: ScholarshipService,
    private professionService: ProfessionService,
    private authenticationService: AuthenticationService,
    private messages: MessagesService,
    private loadingService: LoadingService,
    private route: ActivatedRoute) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    this.loadingService.loadingOn();
    if (this.authenticationService.isLoggedIn) {
      const userId = this.authenticationService.getLoggedUserId();
      return this.userService.get(userId).pipe(
        mergeMap(user => {
          if (user) {
            if (this.userService.role !== null) {
              if (user.profiles.find(profile => profile.userProfileType === 'CLIENT')) {
                this.userService.role = 'CLIENT';
              } else if (user.profiles.find(profile => profile.userProfileType === 'SERVICE_PROVIDER')) {
                this.userService.role = 'SERVICE_PROVIDER';
              }
            }
            return of(user);
          } else {

            return EMPTY;
          }
        }),
        catchError(err => {
          this.messages.showErrors(`An error ocurred: ${err}`);
          return throwError(err);
        }),
        tap(() => {
          this.scholarshipService.getAll(true).subscribe();
          this.professionService.getAll(true).subscribe();
          this.loadingService.loadingOff();
        })
      );
    } else {
      return EMPTY;
    }

  }

}
