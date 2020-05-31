import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map, mergeMap } from 'rxjs/operators';
import { LoggingService } from '@app/services/logging.service';
import { AuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { LoginRequest, OAuth2Response } from '../models/auth.model';
import { Observable, of, pipe, BehaviorSubject } from 'rxjs';
import { APIResponse } from '@app/models/app.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // public members
  bearerToken: OAuth2Response;
  userData$: Observable<any>;
  // private members
  // private _isLoggedIn = false;
  public authProvider;
  public isLoggedIn$: BehaviorSubject<boolean>;
  private loginRequest: LoginRequest = {
    client_id: null,
    client_secret: null,
    username: null,
    password: null,
    identity_source: null,
    id_token: null,
    token: null,
    grant_type: null
  };


  private loginPath = environment.serverBaseURL + '/login';
  private forgotPath = `${environment.serverBaseURL}/forgot`;

  // public methods
  get isLoggedIn(): boolean {
    const bearer = localStorage.getItem('bearerToken');
    const validToken = moment().isBefore(this.getExpiration());
    this.logger.log('isLoggedIn(): validToken', validToken);
    if (!validToken) {
      this.signOut();
    }
    return validToken;
  }

  constructor(
    private http: HttpClient,
    // public socialAuthService: AuthService,
    private logger: LoggingService) {
    this.authProvider = 'JOBBAG';
    this.isLoggedIn$ = new BehaviorSubject(localStorage.getItem('bearerToken') !== null);
  }


  signInWithJobbag(username: string, password: string): Observable<any> {
    this.authProvider = 'JOBBAG';
    const loginRequestJSON = this.parseLoginRequest(username, password, this.authProvider);
    this.logger.log(loginRequestJSON);
    return this.http.post<any>(this.loginPath, loginRequestJSON, { headers: { 'Content-type': 'application/json' } })
      .pipe(map(response => {
        if (response.status_code === 200) {
          const bearer = JSON.parse(response.content);
          this.setSession(bearer);
          return bearer;
        } else {
          const content = (JSON.parse(response.content));
          return content;
        }
      }));
  }

  socialLogin(user: SocialUser, authProvider: string): Observable<any> {
    const loginRequestJSON = this.parseLoginRequest(null, null, authProvider, user.idToken, user.authToken);
    return this.http.post<any>(this.loginPath, loginRequestJSON, { headers: { 'Content-type': 'application/json' } })
      .pipe(
        map(response => {
          if (response.status_code === 200) {
            const bearer = JSON.parse(response.content);
            this.setSession(bearer);
            return bearer;
          } else {
            const error = {
              status_code: response.status_code,
              status_text: response.status_text,
              text: JSON.parse(response.content).text
            };
            return error;
          }
        }));
    // }
  }

  signOut(): void {
    localStorage.clear();
    // this._isLoggedIn = false;
    this.isLoggedIn$.next(false);
    this.authProvider = null;
  }

  private getExpiration() {
    const expiration = localStorage.getItem('expiresAt');
    if (expiration != null) {
      const expiresAt = JSON.parse(expiration);
      this.logger.log('getExpiration() expiresAt', expiresAt);
      return moment(expiresAt);
    }
    return moment();
  }

  private setSession(data: any) {
    if (data != null) {
      localStorage.setItem('bearerToken', JSON.stringify(data));
      this.bearerToken = data;
      const expiresAt = moment().add(this.bearerToken.expires_in, 's');
      localStorage.setItem('expiresAt', JSON.stringify(expiresAt.valueOf()));
      // this._isLoggedIn = true;
      this.isLoggedIn$.next(true);
    } else {
      this.signOut();
    }
  }


  // private mehods
  private parseLoginRequest(username?: string, password?: string, identity_source?: string, id_token?: string, token?: string) {

    this.loginRequest = {
      client_id: null,
      client_secret: null,
      username: null,
      password: null,
      identity_source: null,
      id_token: null,
      token: null,
      grant_type: null
    };
    this.loginRequest.client_id = environment.clientId;
    this.loginRequest.client_secret = environment.clientSecret;
    this.loginRequest.identity_source = identity_source;

    if (identity_source === 'JOBBAG') {
      this.loginRequest.username = username;
      this.loginRequest.password = password;
      this.loginRequest.grant_type = 'password';
    } else
      if (identity_source === 'FACEBOOK' || identity_source === 'GOOGLE') {
        this.loginRequest.id_token = id_token;
        this.loginRequest.token = token;
        this.loginRequest.grant_type = 'password';
      }

    const loginRequestJSON = JSON.stringify(this.loginRequest);
    return loginRequestJSON;

  }

  getToken() {
    if (this.isLoggedIn) {
      const oauth2Response = localStorage.getItem('bearerToken');
      return JSON.parse(oauth2Response).access_token;
    } else {
      return null;
    }
  }

  getLoggedUserId() {
    if (this.isLoggedIn) {
      const oauth2Response = localStorage.getItem('bearerToken');
      return JSON.parse(oauth2Response).user_id;
    } else {
      return null;
    }
  }


}
