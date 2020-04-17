import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User, UserProfile, UserProfileBriefcase } from '../models/user.model';
import { LoggingService } from '@app/services/logging.service';
import { environment } from '@environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { APIResponse } from '@app/models/app.model';
import { UserCacheService } from './user-cache.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _loggedUser: User;
  apiPath = environment.apiBaseURL;

  private userRole: string; // Es para saber si el usuario esta autenticado como CLIENT o SERVICE_PROVIDER


  constructor(
    private http: HttpClient,
    private userCacheService: UserCacheService,
    private logging: LoggingService) {
      this.userRole = 'CLIENT';
    }


  public get loggedUser(): User {
    return JSON.parse(localStorage.getItem('loggedUser'));
  }


  public get role(): string {
    return this.userRole;
  }

  public set role(role: string) {
    this.userRole = role;
  }


  get(userId: string): Observable<User> {
    // const user_id = JSON.parse(localStorage.getItem('bearerToken')).user_id;
    return this.http.get<APIResponse>(this.apiPath + '/user/get/' + userId).pipe(
      map(response => {
        if (response.status_code === 200) { // Si el status del response es OK retorno contento como dato del observable
          return JSON.parse(JSON.parse(response.content));
        } else {
          return throwError( // Si no es OK el status del response, lanzo un error con el status y el text
            response.status_code + ': ' + response.content.text
          );
        }
      }),
      catchError(err => { // Captura si hubo algun error en la llamada y lo relanza
        console.log(err);
        return throwError(err);  // Relanzo el error con el status y el detail
      }),
      tap((response: User) => {
        this._loggedUser = response; // Salvo el user en el storage
        this.userCacheService.setUser(response);
      })
    );
  }

  edit(data: any): Observable<User> {
    const req = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      user: data
    };
    console.log('data request: ', req);
    return this.http.put<APIResponse>(this.apiPath + '/user', req).pipe(
      map(response => {
        const content = JSON.parse(response.content);
        console.log(content);
        if (response.status_code === 200) {
          return content;
        } else {
          return throwError( // Si no es OK el status del response, lanzo un error con el status y el text
            response.status_code + ': ' + response.content.text
          );
        }
      }),
      catchError(err => { // Captura si hubo algun error en la llamada y lo relanza
        console.log(err);
        return throwError(err);  // Relanzo el error con el status y el detail
      }),
      tap((response: User) => {
        this.userCacheService.setUser(response);
      })
    );
  }

  delete(userId: string) {

  }


  // getRoles() {
  //   return this.loggedUser.roles;
  // }



}
