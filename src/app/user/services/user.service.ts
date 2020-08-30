
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
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

  forgotPath = `${environment.serverBaseURL}/password`;

  constructor(
    private http: HttpClient,
    private userCacheService: UserCacheService,
    private authService: AuthenticationService,
    private logger: LoggingService) {

    const cachedUser = this.userCacheService.getUser();
    this.userSubject.next(cachedUser);
    if (!!cachedUser) {
      this.selectLoggedUserActiveProfile(cachedUser);
    }
    this.roleSubject.next(this.userRole);
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      if (!loggedIn) {
        this.userSubject.next(null);
        this.roleSubject.next(null);
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


  get(userId: number): Observable<User> {
    // const user_id = JSON.parse(localStorage.getItem('bearerToken')).user_id;
    // const cachedUser = this.userCacheService.getUser();
    // if (!!cachedUser) {
    //   return of(cachedUser);
    // }
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
        this.logger.log(err);
        return throwError(err);  // Relanzo el error con el status y el detail
      }),
      tap((response: User) => {
        this.selectLoggedUserActiveProfile(response);
        this.userCacheService.setUser(response);
        this.userSubject.next(response); // Emito el user y lo salvo en el storage
      })
    );
  }

  private selectLoggedUserActiveProfile(user: User) {
    if (this.roleSubject.value == null) {
      if (!!user.profiles.find(profile => profile.userProfileType === 'CLIENT')) {
        this.roleSubject.next('CLIENT');
      } else if (!!user.profiles.find(profile => profile.userProfileType === 'SERVICE_PROVIDER')) {
        this.roleSubject.next('SERVICE_PROVIDER');
      } else {
        this.roleSubject.next(null);
      }
    }
  }

  recoverPassword(username: string) {
    const req = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      username
    };
    return this.http.post<APIResponse>(this.forgotPath, req).pipe(
      map(response => {
        const content = JSON.parse(response.content);
        if (response.status_code === 200) {
          return true;
        } else {
          throw new Error(`${content.text}`);
        }
      })
    );
  }

  editPassword(data) {
    const req = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      ...data
    };
    return this.http.put<APIResponse>(`${this.apiPath}/user/password`, req).pipe(
      map(response => {
        const content = JSON.parse(response.content);
        if (response.status_code === 200) {
          return true;
        } else {
          throw new Error(`${content.text}`);
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
    return this.http.put<APIResponse>(this.apiPath + '/user', req).pipe(
      map(response => {
        const content = JSON.parse(JSON.parse(response.content));
        if (response.status_code === 200) {
          return content;
        } else {
          return throwError( // Si no es OK el status del response, lanzo un error con el status y el text
            response.status_code + ': ' + response.content.text
          );
        }
      }),
      catchError(err => { // Captura si hubo algun error en la llamada y lo relanza
        this.logger.log(err);
        return throwError(err);  // Relanzo el error con el status y el detail
      }),
      tap((response: User) => {
        let user = this.userCacheService.getUser();
        user.id = response.id;
        user.email = response.email;
        user.username = response.username;
        this.userSubject.next(user); // Salvo el user en el storage
        this.userCacheService.setUser(user);
      })
    );
  }

  delete(userId: string) {

  }


  // getRoles() {
  //   return this.loggedUser.roles;
  // }



}
