import { Injectable } from '@angular/core';
import { User, UserProfile, UserProfileBriefcase } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';

// localStorage Keys:
const USER = 'loggedUser';
const PROFILES = 'userProfiles';
const BRIEFCASES = 'briefcases';
const ROLE = 'activeRole';


@Injectable({
  providedIn: 'root'
})
export class UserCacheService {

  private subject = new BehaviorSubject<User>(null);

  user$ = this.subject.asObservable();

  constructor() {
    this.subject.next(JSON.parse(localStorage.getItem(USER)));
  }

  getRole() {
    return localStorage.getItem(ROLE);
  }

  setRole(role: string) {
    localStorage.setItem(ROLE, role);
  }

  setUser(user: User) {
    localStorage.setItem(USER, JSON.stringify(user));
    this.subject.next(user);
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem(USER));
  }

  setProfiles(userProfiles: UserProfile[]) {
    let user: User = JSON.parse(localStorage.getItem(USER));
    user.profiles = userProfiles;
    localStorage.setItem(USER, JSON.stringify(user));
    this.subject.next(user);
  }

  getProfiles(): UserProfile[] {
    const user: User = JSON.parse(localStorage.getItem(USER));
    if (user) {
      return user.profiles;
    }
    return null;
  }

  getBriefcases(): UserProfileBriefcase[] {
    const user: User = JSON.parse(localStorage.getItem(USER));
    const userProfile =  user.profiles.find(profile => profile.userProfileType === 'SERVICE_PROVIDER');
    if (!! userProfile) {
      return userProfile.briefcases;
    }
    return [];
  }

  setBriefcases(briefcases: UserProfileBriefcase[]) {
    let user: User = JSON.parse(localStorage.getItem(USER));
    const index =  user.profiles.findIndex(profile => profile.userProfileType === 'SERVICE_PROVIDER');
    if (!! index) {
      user.profiles[index].briefcases = briefcases;
    }

    localStorage.setItem(USER, JSON.stringify(user));
    this.subject.next(user);

  }

  setProfilePicture(profileId: number, picture: string) {
    let user: User = JSON.parse(localStorage.getItem(USER));
    const index =  user.profiles.findIndex(profile => profile.id === profileId);
    if (!! index) {
      user.profiles[index].picture = picture;
    }
    localStorage.setItem(USER, JSON.stringify(user));
    this.subject.next(user);

  }


  setProfileCV(profileId: number, cv: string) {
    let user: User = JSON.parse(localStorage.getItem(USER));
    const index =  user.profiles.findIndex(profile => profile.id === profileId);
    if (!! index) {
      user.profiles[index].cv = cv;
    }
    localStorage.setItem(USER, JSON.stringify(user));
    this.subject.next(user);

  }
}
