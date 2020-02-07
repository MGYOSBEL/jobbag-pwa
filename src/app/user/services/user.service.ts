import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User, Scholarship, UserProfile, Briefcase } from '../models/user.model';
import { LoggingService } from '@app/services/logging.service';
import { environment } from '@environments/environment';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedUser: User;
  apiPath = environment.apiBaseURL;
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

  constructor(private http: HttpClient,
              private logging: LoggingService) { }

  getUser(userId: string): Observable<User> {
    // const user_id = JSON.parse(localStorage.getItem('bearerToken')).user_id;
    return this.http.get<any>(this.apiPath + '/user/get/' + userId).pipe(
      tap((response) => {
        if (response.status_code === 200) {
          this.loggedUser = JSON.parse(JSON.parse(response.content));
        }
      })
    );
  }

  getAllScolarships() {
    return this.http.get<any>(this.apiPath + '/scholarship/all').pipe(
      map(data => JSON.parse(JSON.parse(data.content)))
    );
  }

  getAllProfessions() {
    return this.http.get<any>(this.apiPath + '/profession/all/en').pipe(
      map(data => JSON.parse(JSON.parse(data.content)))
    );
  }

  createUserProfile() {
    return this.http.post<any>(this.apiPath + '/user_profile', this.userProfileRequest).pipe(
      map(response => JSON.parse(JSON.parse(response.content))),
      tap(response => {
        this.loggedUser = response;
        localStorage.setItem('userProfile', response);
      })
    );
  }

  setUserProfileData(data) {
    this.userProfileRequest.phone_number = data.phone_number;
    this.userProfileRequest.comment = data.comment;
    this.userProfileRequest.summary = data.summary;
    this.userProfileRequest.user_id = data.user_id;
    this.userProfileRequest.scholarship_id = data.scholarship_id;
    this.userProfileRequest.user_profile_type = data.user_profile_type;
  }

  setUserProfileBriefcase(data) {
    for (const iterator of data) {
      this.userProfileRequest.user_profile_briefcase[this.userProfileRequest.user_profile_briefcase.length] = {
        comments: iterator.comments,
        description: iterator.description,
        start_date: iterator.startDate,
        end_date: iterator.endDate,
        id_profession: iterator.idProfession
      };
    }
    console.log('setUserProfileBriefcase: ' + JSON.stringify(this.userProfileRequest));
  }

  getBriefcase(): Briefcase[] {
    for (const iterator of this.loggedUser.user_profiles) {
      if (iterator.userProfileType.type === 'SERVICE_PROVIDER') {
        return iterator.briefcases;
      }
    }
  }



}
