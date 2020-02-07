import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { RegisterRequest } from '../models/auth.model';
import { QueryValueType } from '@angular/compiler/src/core';
import { AuthenticationService } from '../services/authentication.service';
import { AuthService, SocialUser, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { LoggingService } from '@app/services/logging.service';
import { ErrorService } from '@app/errors/error.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email = new FormControl('');
  name = new FormControl('');
  password = new FormControl('');
  confirmPassword = new FormControl('');
  registerForm: FormGroup;
  returnUrl: string;

  registerRequest: RegisterRequest;

  loading = false;
  socialUser: SocialUser;
  hiddenPasswords = false;
  registerErr: {
    err: boolean;
    message?: string;
  };

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private logging: LoggingService,
              private socialAuthService: AuthService,
              private error: ErrorService,
              private authenticationService: AuthenticationService) {

    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
    this.registerErr = {err: false};

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/user';
  }

  ngOnInit() {
    this.socialAuthService.authState.subscribe(
      (user) => {
        if (user != null && this.loading === true) {
          this.loading = false;
          this.hiddenPasswords = true;
          this.socialUser = user;
          localStorage.clear();
          localStorage.setItem('socialUser', JSON.stringify(user));
          this.email.setValue(user.email);
          this.name.setValue(user.name);
          this.password.setValue(user.name);
          this.confirmPassword.setValue(user.name);
          this.registerRequest = {
            client_id: environment.clientId,
            client_secret: environment.clientSecret,
            username: this.name.value,
            password: this.password.value,
            email: this.email.value,
            provider: this.authenticationService.authProvider,
            social_id: user.id
          };
          this.register();
        }
      }
    );

  }

  register() {
    this.loading = true;
    console.log('REGISTER REQUEST: ' + JSON.stringify(this.registerRequest));
    this.http.post<any>('http://localhost/user', this.registerRequest, { headers: { 'Content-type': 'application/json' } })
      .subscribe(
        (data) => {
          if (data.status_code === 200) {
            const content = JSON.parse(JSON.parse(data.content));
            const username = content.username;
            this.logging.log('REGISTER RESPONSE: ' + JSON.stringify(content));
            if (this.registerRequest.provider === 'JOBBAG') {
              this.authenticationService.signInWithJobbag(this.name.value, this.password.value)
              .subscribe(
                data => {
                  const role = this.route.snapshot.queryParams.role;
                  console.log('role: ' + role);
                  if (this.authenticationService.isLoggedIn) {
                    const user_id = JSON.parse(JSON.parse(localStorage.getItem('bearerToken')).content).user_id;
                    const profileExtrasUrl = '/user/' + user_id + '/profile-extras';
                    if (role) {
                      console.log('navegando a profile extras...');
                      this.router.navigate([profileExtrasUrl], { queryParams: { role } });
                    } else {
                      this.router.navigate(['/user/3/select-role'], { queryParams: { returnUrl: profileExtrasUrl } });
                    }
                  }
                });
            } else {
              this.authenticationService.socialLogin(this.socialUser, this.authenticationService.authProvider)
              .subscribe(
                (response) => {
                  this.logging.log('SOCIAL LOGIN RESPONSE: ' + response);
                  if (response) {
                    const role = this.route.snapshot.queryParams.role;
                    console.log('role: ' + role);
                    if (this.authenticationService.isLoggedIn) {
                      const user_id = JSON.parse(JSON.parse(localStorage.getItem('bearerToken')).content).user_id;
                      const profileExtrasUrl = '/user/' + user_id + '/profile-extras';
                      if (role) {
                        console.log('navegando a profile extras...');
                        this.router.navigate([profileExtrasUrl], { queryParams: { role } });
                      } else {
                        this.router.navigate(['/user/3/select-role'], { queryParams: { returnUrl: profileExtrasUrl } });
                      }
                    }
                  } else {
                    this.logging.log('isLoggedIn subscription was false.... (LoginComponent)');
                  }
                }
              );

            }

          } else {
            const content = (JSON.parse(data.content));
            this.registerErr = {
              err: true,
              message: content.text
            };
            this.loading = false;
            this.hiddenPasswords = false;
            this.router.navigate(['./'], {relativeTo: this.route});
          }

        });

  }

  facebookRegister() {
    this.loading = true;
    this.authenticationService.authProvider = 'FACEBOOK';
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  googleRegister() {
    this.loading = true;
    this.authenticationService.authProvider = 'GOOGLE';
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  jobbagRegister() {
    this.loading = true;
    this.authenticationService.authProvider = 'JOBBAG';
    this.registerRequest = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      username: this.name.value,
      password: this.password.value,
      email: this.email.value,
      provider: this.authenticationService.authProvider,
      social_id: null
    };

    this.register();
  }

  // passwordMatchValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  //   const password = control.get('password');
  //   const confirmPassword = control.get('confirmPassword');

  //   return password && confirmPassword && password.value === confirmPassword.value ? null : { 'passwordMissMatch': true } ;
  // }

}
