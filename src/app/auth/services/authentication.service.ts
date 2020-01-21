import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { LoggingService } from '@app/logging.service';
import { UserService } from '@app/user/services/user.service';
import { AuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { Observable, of, from } from 'rxjs';
import {LoginRequest} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // public members
  bearerToken;
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

  loginPath = environment.apiLoginURL;

  // public methods
  get isLoggedIn(): boolean {
    const bearer = localStorage.getItem('bearerToken');
    return this._isLoggedIn && (bearer != null);
  }

  constructor(private http: HttpClient,
              private userService: UserService,
              private socialAuthService: AuthService,
              private logging: LoggingService) {
      this.socialAuthService.authState.subscribe(
        (user) => {
          this.socialLogin(user, this.authProvider );
        }
      );

  }


  signInWithJobbag(username: string, password: string) {
    this.authProvider = 'JOBBAG';
    this.logging.log('starting signInWithJobbag routine... (AuthenticationService)');
    const loginRequestJSON = this.parseLoginRequest(username, password, this.authProvider);
    this.logging.log('exiting signInWithJobbag routine. Returning the post Observable(not subscribed yet)... (AuthenticationService)');
    return this.http.post<any>( this.loginPath, loginRequestJSON, { headers: { 'Content-type': 'application/json' } })
      .pipe(map(response => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // response = JSON.parse(response);
        this.setLogin(response);
        return response;
      }));
  }

  private socialLogin(user: SocialUser, authProvider: string) {
    this.logging.log('signInWith' + authProvider + ' authState subscribe routine...');
    this.socialUser = user;
    if (user != null) {
      this.logging.log('_isLoggedIn:' + this._isLoggedIn);
      const loginRequestJSON = this.parseLoginRequest(null, null, authProvider, this.socialUser.idToken, this.socialUser.authToken);
      this.http.post<any>(this.loginPath, loginRequestJSON, { headers: { 'Content-type': 'application/json' } })
        .subscribe(response => {
         this.setLogin(response);
        });
    }
  }

  signInWithGoogle() {
    this.logging.log('starting signInWithGoogle routine...');
    this.authProvider = 'GOOGLE';
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.logging.log('exiting signInWithGoogle routine...');
    return this.socialAuthService.authState;
  }

  signInWithFB() {
    this.logging.log('starting signInWithFacebook routine...');
    this.authProvider = 'FACEBOOK';
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.logging.log('exiting signInWithFacebook routine...');
    return this.socialAuthService.authState;
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
      this.logging.log('saving the token for ' + this.authProvider);
      localStorage.setItem('bearerToken', JSON.stringify(data));
      this.bearerToken = data;
      this._isLoggedIn = true;
    } else {
      this.logging.log('Error in the login endpoint ' + data);
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
    this.logging.log('null token request: ' + JSON.stringify(this.loginRequest) + ' ... (AuthenticationService)');
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
    this.logging.log('Filled token request: ' + JSON.stringify(this.loginRequest) + ' ... (AuthenticationService)');
    return loginRequestJSON;

  }


}
