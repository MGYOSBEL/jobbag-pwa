import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { LoggingService } from '../logging.service';
import { UserService } from './user.service';
import { AuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';

interface TokenRequest {
  client_id: string;
  client_secret: string;
  username: string;
  password: string;
  identity_source: string;
  id_token: string;
  token: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // public members
  bearerToken;
  // private members
  private socialUser: SocialUser;
  private _isLoggedIn = false;

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }

  private tokenRequest: TokenRequest = {
    client_id: null,
    client_secret: null,
    username: null,
    password: null,
    identity_source: null,
    id_token: null,
    token: null
  };

  // public methods
  constructor(private http: HttpClient,
              private userService: UserService,
              private socialAuthService: AuthService,
              private logging: LoggingService) {
      this.socialAuthService.authState.subscribe(
        (user) => {
        this.socialUser = user;
        // this._isLoggedIn = (user != null);
    });
  }


  login(tokenRequestJSON: string) {

    return this.http.post<any>('http://localhost/login', tokenRequestJSON, {headers: {'Content-type' : 'application/json'}})
      .pipe(map(token => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        this.logging.log('saving the token');
        localStorage.setItem('bearerToken', JSON.stringify(token));
        this.bearerToken = token;
        this._isLoggedIn = true;
        return token;
      }));

  }

  signInWithJobbag(username: string, password: string) {
    this.logging.log('starting login routine(authService)');
    const tokenRequestJSON = this.parseTokenRequest(username, password, 'JOBBAG');
    this.logging.log('filled token request: ' + tokenRequestJSON);
    return this.login(tokenRequestJSON);
  }

  signInWithGoogle() {
    this.logging.log('Starting Login with GOOGLE routine...');
    return this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      () => {
        this.logging.log('SocialUser: ' + JSON.stringify(this.socialUser));
        const tokenRequestJSON = this.parseTokenRequest(null, null, 'GOOGLE', this.socialUser.idToken, this.socialUser.authToken);
        this.login(tokenRequestJSON).subscribe(
          () => this.logging.log('Login with google subscribe routine...')
        );
      }
    );
  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    if (this.tokenRequest.identity_source === 'GOOGLE' || this.tokenRequest.identity_source === 'FACEBOOK') {
      this.socialAuthService.signOut();
    } else {
      localStorage.removeItem('bearerToken');
    }
    this._isLoggedIn = false;
  }


  // private mehods
  private parseTokenRequest(username?: string, password?: string, identity_source?: string, id_token?: string, token?: string) {

    this.tokenRequest = {
      client_id: null,
      client_secret: null,
      username: null,
      password: null,
      identity_source: null,
      id_token: null,
      token: null
    };
    this.logging.log('null token request: ' + JSON.stringify(this.tokenRequest));
    this.tokenRequest.client_id = environment.clientId;
    this.tokenRequest.client_secret = environment.clientSecret;
    this.tokenRequest.identity_source = identity_source;

    if (identity_source === 'JOBBAG') {
      this.tokenRequest.username = username;
      this.tokenRequest.password = password;
    } else
    if (identity_source === 'FACEBOOK' || identity_source === 'GOOGLE') {
      this.tokenRequest.id_token = id_token;
      this.tokenRequest.token = token;
    }

    const tokenRequestJSON = JSON.stringify(this.tokenRequest);

    return tokenRequestJSON;

  }





}
