import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { BriefcaseService } from './briefcase.service';
import { UserProfile, Briefcase } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private apiPath = environment.apiBaseURL;

  currentUserProfile: UserProfile;

  private userProfileRequest = {
    client_id: environment.clientId,
    client_secret: environment.clientSecret,
    phone_number: '',
    comment: '',
    summary: '',
    user_id: '',
    scholarship_id: '',
    user_profile_type: '',
    user_profile_briefcase: []
  };

  constructor(private http: HttpClient
              ) { }



  get() {}

  getAll() {}

  create() {
    return this.http.post<any>(this.apiPath + '/user_profile', this.userProfileRequest).pipe(
      map(response => {
        return JSON.parse(response.content);
      }),
      tap(response => {
      })
    );
  }

  edit() {
    return this.http.put<any>(this.apiPath + '/user_profile', this.userProfileRequest)
    .pipe(
      map(response => JSON.parse(response.content))
    );
  }

  delete() {}

  cacheUserProfileData(data) {
    this.userProfileRequest.phone_number = data.phone_number;
    this.userProfileRequest.comment = data.comment;
    this.userProfileRequest.summary = data.summary;
    this.userProfileRequest.user_id = data.user_id;
    this.userProfileRequest.scholarship_id = data.scholarship_id;
    this.userProfileRequest.user_profile_type = data.user_profile_type;
  }

  cacheBriefcase(bc: any) {
    this.userProfileRequest.user_profile_briefcase.push(bc);
  }
}
