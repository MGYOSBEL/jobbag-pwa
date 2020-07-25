import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, EMPTY, of } from 'rxjs';
import { UserProfile } from '../models/user.model';
import { UserProfileService } from './user-profile.service';
import { mergeMap } from 'rxjs/operators';
import { MessagesService } from '@app/services/messages.service';

@Injectable({ providedIn: 'root' })
export class ProfileResolverService implements Resolve<UserProfile> {

  constructor(
    private userProfileService: UserProfileService,
    private messages: MessagesService,
    private router: Router
  ) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<UserProfile> {
    const userProfileId = route.params.id;
    return this.userProfileService.get(userProfileId).pipe(
      mergeMap(userProfile => {
        if (!!userProfile) {
          return of(userProfile);
        } else {
          this.router.navigate(['error']);
          this.messages.showErrors('The user profile does not exist or can not be found.');
          return EMPTY;
        }
      }
      )
    );
  }
}
