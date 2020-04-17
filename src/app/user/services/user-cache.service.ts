import { Injectable } from '@angular/core';
import { User, UserProfile, UserProfileBriefcase } from '../models/user.model';

// localStorage Keys:
const USER = 'loggedUser';
const PROFILES = 'userProfiles';
const BRIEFCASES = 'briefcases';


@Injectable({
  providedIn: 'root'
})
export class UserCacheService {

  constructor() { }

  setUser(user: User) {
    localStorage.setItem(USER, JSON.stringify(user));
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem(USER));
  }

  setProfiles(userProfiles: UserProfile[]) {
    let user: User = JSON.parse(localStorage.getItem(USER));
    user.profiles = user.profiles.map(profile => userProfiles.find(elem => elem.id === profile.id));
    localStorage.setItem(USER, JSON.stringify(user));
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
    return userProfile.briefcases || [];
  }

  setBriefcases(briefcases: UserProfileBriefcase[]) {
    let user: User = JSON.parse(localStorage.getItem(USER));
    const index =  user.profiles.findIndex(profile => profile.userProfileType === 'SERVICE_PROVIDER');
    user.profiles[index].briefcases = briefcases;

    localStorage.setItem(USER, JSON.stringify(user));


  }
}
