import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { LoggingService } from '../logging.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private logging: LoggingService) { }

  getUser(): Observable<User> {
    return this.http.get<User>('http://localhost/api/user/get/test@gmail.com');
  }
}
