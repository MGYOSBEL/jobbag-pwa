import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User, UserProfile, UserProfileBriefcase } from '../models/user.model';
import { LoggingService } from '@app/services/logging.service';
import { environment } from '@environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { APIResponse } from '@app/models/app.model';
import { UserCacheService } from './user-cache.service';
import { AuthenticationService } from '@app/auth/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<User>(null);

  loggedUser$ = this.userSubject.asObservable();

  private roleSubject = new BehaviorSubject<string>(null);

  role$ = this.roleSubject.asObservable();

  apiPath = environment.apiBaseURL;

  private userRole: string; // Es para saber si el usuario esta autenticado como CLIENT o SERVICE_PROVIDER


  constructor(
    private http: HttpClient,
    private userCacheService: UserCacheService,
    private authService: AuthenticationService,
    private logging: LoggingService) {
      this.userRole = this.userCacheService.getRole() || 'CLIENT';
      this.userSubject.next(this.userCacheService.getUser());
      this.roleSubject.next(this.userRole);

      this.authService.isLoggedIn$.subscribe(loggedIn => {
        if (!loggedIn) {
          this.userSubject.next(null);
          this.roleSubject.next(null);
          console.log('null user emitted');
        } else {
          // this.userSubject.next(null);
          // console.log('new user emitted: ', this.userSubject.value);
        }
      });

      this.userCacheService.user$.subscribe(user => this.userSubject.next(user));
    }




  public get loggedUser(): User {
    return JSON.parse(localStorage.getItem('loggedUser'));
  }


  public get role(): string {
    return this.userRole;
  }

  public set role(role: string) {
    this.userRole = role;
    this.userCacheService.setRole(role);
    this.roleSubject.next(role);

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
        this.userSubject.next(response); // Emito el user y lo salvo en el storage
        console.log('emitted user: ', response);
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
        const content = (JSON.parse(response.content));
        console.log('edited User: ', content);
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
        console.log('response', response);
        const user = this.userCacheService.getUser();
        const user1 = {
                ...user,
                id: response.id,
                email: response.email,
                username: response.username,

              };
        console.log(user1);
        this.userSubject.next(user1); // Salvo el user en el storage
        this.userCacheService.setUser(user1);
      })
    );
  }

  delete(userId: string) {

  }


  // getRoles() {
  //   return this.loggedUser.roles;
  // }



}
