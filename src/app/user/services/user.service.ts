import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { LoggingService } from '@app/services/logging.service';
import { environment } from '@environments/environment';

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



}
