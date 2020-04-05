import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User, UserProfile, UserProfileBriefcase } from '../models/user.model';
import { LoggingService } from '@app/services/logging.service';
import { environment } from '@environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { APIResponse } from '@app/models/app.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _loggedUser: User;
  apiPath = environment.apiBaseURL;


  constructor(private http: HttpClient,
              private logging: LoggingService) { }


  public get loggedUser(): User {
    return JSON.parse(localStorage.getItem('loggedUser'));
  }


  get(userId: string): Observable<User> {
    // const user_id = JSON.parse(localStorage.getItem('bearerToken')).user_id;
    return this.http.get<APIResponse>(this.apiPath + '/user/get/' + userId).pipe(
      catchError(err => { // Captura si hubo algun error en la llamada y lo relanza
        console.log(err);
        throw new Error(err);  // Relanzo el error con el status y el detail
      }),
      map(response => {
        if (response.status_code === 200) { // Si el status del response es OK retorno contento como dato del observable
          return JSON.parse(JSON.parse(response.content));
        } else {
          throw new Error( // Si no es OK el status del response, lanzo un error con el status y el text
            response.status_code + ': ' + response.content.text
          );
        }      }),
      tap((response: User) => {
        this._loggedUser = response; // Salvo el user en el storage
        localStorage.setItem('loggedUser', JSON.stringify({
          id: response.id,
          username: response.username,
          email: response.email
        }));
        if (response.profiles.length) {
          const userProfiles: Array<UserProfile> = response.profiles; // Salvo los userProfiles en el Storage
          localStorage.setItem('userProfiles', JSON.stringify(response.profiles));
          console.log(userProfiles);
          const index = userProfiles.findIndex(elem => elem.userProfileType === 'SERVICE_PROVIDER');
          console.log('index', index);
          if (index >= 0) {
            // Salvo los briefcases en el Storage
            const briefcases: Array<UserProfileBriefcase> = userProfiles[index].briefcases || [];
            localStorage.setItem('briefcases', JSON.stringify(briefcases));

          }
        } else { // No hay ningun perfil creado, guardo los arrays vacios
          localStorage.setItem('userProfiles', JSON.stringify([]));
          localStorage.setItem('briefcases', JSON.stringify([]));
        }
      })
    );
  }

  edit(data: any): Observable<User> {
    const req = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      user: data
    };
    console.log('data request: ' ,  req);
    return this.http.put<APIResponse>(this.apiPath + '/user', req).pipe(
      map(response => {
        const content = JSON.parse(response.content);
        console.log(content);
        if (response.status_code === 200) {
          localStorage.setItem('User', JSON.stringify(req.user));
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

  delete(userId: string) {

  }


  // getRoles() {
  //   return this.loggedUser.roles;
  // }



}
