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


  constructor(private http: HttpClient,
              private logging: LoggingService) { }

  get(userId: string): Observable<User> {
    // const user_id = JSON.parse(localStorage.getItem('bearerToken')).user_id;
    return this.http.get<any>(this.apiPath + '/user/get/' + userId).pipe(
      tap((response) => {
        this.loggedUser = response;
        localStorage.setItem('loggedUser', JSON.stringify(response));
      })
    );
  }

  edit(data: any) {
    console.log('data request: ' ,  data);
    return this.http.put<any>(this.apiPath + '/user', data).pipe(
      map(response => {
        const content = JSON.parse(response.content);
        console.log(content);
        if (response.status_code === 200) {
          return content;
        } else {
          return {
            error: true,
            statusCode: response.status_code,
            text: response.content.text
          };
        }
      }, err => {
        console.log('SERVER ERROR!!!!!');
        console.log(err);
      }),
      tap(response => {
        console.log('data response ' , response);
        if (!response.error) {
          localStorage.setItem('loggedUser', (response));
        }
      })
    );
  }


  getRoles() {
    return this.loggedUser.roles;
  }



}
