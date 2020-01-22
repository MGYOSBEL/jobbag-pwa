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

  constructor(private http: HttpClient, private logging: LoggingService) { }

  getUser(): Observable<User>  {
    const user_id = JSON.parse(localStorage.getItem('bearerToken')).user_id;
    this.logging.log('User Service returning get<User> Observable. Not subscribed yet.');
    return this.http.get<User>( this.apiPath + '/user/get/' + user_id);

  }
}
