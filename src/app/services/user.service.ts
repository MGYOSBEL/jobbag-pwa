import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { LoggingService } from '../logging.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedUser: User;

  constructor(private http: HttpClient, private logging: LoggingService) { }

  getUser(): Observable<User>  {
    const user_id = JSON.parse(localStorage.getItem('bearerToken')).user_id;
    return this.http.get<User>('http://localhost/api/user/get/' + user_id);

  }
}
