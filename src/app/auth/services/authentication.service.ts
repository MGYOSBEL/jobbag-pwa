import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { LoggingService } from '@app/services/logging.service';
import { AuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import {LoginRequest} from '../models/auth.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // public members
  bearerToken;
  userData$: Observable<any>;
  // private members
  private socialUser: SocialUser;
  private _isLoggedIn = false;
  private authProvider;
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


  private loginPath = environment.apiLoginURL;

  // public methods
  get isLoggedIn(): boolean {
    const bearer = localStorage.getItem('bearerToken');
    return (this._isLoggedIn && (bearer != null));
  }

  constructor(private http: HttpClient,
              private socialAuthService: AuthService,
              private logging: LoggingService) {
    this.socialAuthService.authState.subscribe(
      (user) => {
        this.logging.log('SocialUser: ' + JSON.stringify(user));
        this.socialLogin(user, this.authProvider);
      }
    );
  }


  signInWithJobbag(username: string, password: string) {
    this.authProvider = 'JOBBAG';
    const loginRequestJSON = this.parseLoginRequest(username, password, this.authProvider);
    return this.http.post<any>( this.loginPath, loginRequestJSON, { headers: { 'Content-type': 'application/json' } })
      .pipe(map(response => {
        if (response.status_code === 200) {
          this.setLogin(response);
        }
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // response = JSON.parse(response);
        return response;
      }));
  }

  private socialLogin(user: SocialUser, authProvider: string) {
    this.socialUser = user;
    this.logging.log('Entering socialLogin...');
    if (user != null) {
      this.logging.log('user isnt null...');
      const loginRequestJSON = this.parseLoginRequest(null, null, authProvider, this.socialUser.idToken, this.socialUser.authToken);
      return this.http.post<any>(this.loginPath, loginRequestJSON, { headers: { 'Content-type': 'application/json' } })
        .pipe(map(response => {
          if (response.status_code === 200) {
            this.setLogin(response);
          }
          return response;
        }));
    }
  }

  signInWithGoogle(): Observable<any> {
    this.authProvider = 'GOOGLE';
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    return this.socialLogin(this.socialUser, this.authProvider);
  }

  signInWithFB(): Observable<any> {
    this.authProvider = 'FACEBOOK';
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    return this.socialLogin(this.socialUser, this.authProvider);
  }

  signOut(): void {
    if (this.authProvider === 'GOOGLE' || this.authProvider === 'FACEBOOK') {
      this.socialAuthService.signOut();
    }
    this.socialUser = null;
    localStorage.removeItem('bearerToken');
    this._isLoggedIn = false;
    this.authProvider = null;
  }

  private setLogin(data: any) {
    if (data != null) {
      localStorage.setItem('bearerToken', JSON.stringify(data));
      this.bearerToken = data;
      this._isLoggedIn = true;
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


}
