import { Injectable } from '@angular/core';
import { UserProfileService } from './user-profile.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {last} from 'rxjs/operators';
import { UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ActiveProfileService {

  private activeProfileSubject: BehaviorSubject<string>;
  activeProfileType$: Observable<string>;
  activeProfile: UserProfile;

  constructor(private userProfileService: UserProfileService) {

    this.activeProfileSubject = new BehaviorSubject<string>('CLIENT');
    this.activeProfileType$ = this.activeProfileSubject.asObservable();


  }

  activateClient() {
    this.activeProfile = this.userProfileService.client;
    console.log(this.activeProfile);
    this.activeProfileSubject.next('CLIENT');
  }

  activateServiceProvider() {
    this.activeProfile = this.userProfileService.client;
    console.log(this.activeProfile);
    this.activeProfileSubject.next('SERVICE PROVIDER');
  }

  getProfile(): Observable<UserProfile> {
    return of (this.activeProfile);
  }


}
