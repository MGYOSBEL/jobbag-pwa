import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User, Scholarship, UserProfile } from '../models/user.model';
import { LoggingService } from '@app/services/logging.service';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedUser: User;
  apiPath = environment.apiBaseURL;

  constructor(private http: HttpClient,
              private logging: LoggingService) { }

  getUser(userId: string): Observable<User> {
    // const user_id = JSON.parse(localStorage.getItem('bearerToken')).user_id;
    return this.http.get<User>(this.apiPath + '/user/get/' + userId);
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

  createUserProfile(data: any) {
    return this.http.post<any>(this.apiPath + '/user_profile', data).pipe(
      map(response => JSON.parse(JSON.parse(response.content)))
    );
  }



}
