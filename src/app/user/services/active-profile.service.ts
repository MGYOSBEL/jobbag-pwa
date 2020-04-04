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


    const cachedProfileType = localStorage.getItem('activeProfile');
    this.activeProfileSubject = new BehaviorSubject<string>(cachedProfileType || '');
    this.activeProfileType$ = this.activeProfileSubject.asObservable();
    if (cachedProfileType === 'CLIENT') {
      console.clear();
      console.log('CLIENT activated');
      this.activateClient();
    } else if (cachedProfileType === 'SERVICE PROVIDER') {
      console.clear();
      console.log('PROVIDER activated');
      this.activateServiceProvider();
    }

  }

  activateClient() {
    this.activeProfile = this.userProfileService.client;
    console.log('ActiveProfile: ', this.activeProfile);
    this.activeProfileSubject.next('CLIENT');
    localStorage.setItem('activeProfile', 'CLIENT');

  }

  activateServiceProvider() {
    this.activeProfile = this.userProfileService.serviceProvider;
    console.log('ActiveProfile: ', this.activeProfile);
    this.activeProfileSubject.next('SERVICE PROVIDER');
    localStorage.setItem('activeProfile', 'SERVICE PROVIDER');
  }

  getProfile(): Observable<UserProfile> {
    return of (this.activeProfile);
  }


}
