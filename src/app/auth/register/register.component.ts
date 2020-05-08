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
import { passwordMissmatchValidator } from '@app/sharedComponents/customValidators';
import { UserService } from '@app/user/services/user.service';
import { LoadingService } from '@app/services/loading.service';
import { MessagesService } from '@app/services/messages.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  returnUrl: string;
  role: string;
  private registerPath = environment.serverBaseURL + '/user';
  registerRequest: RegisterRequest;

  loading = false;
  socialUser: SocialUser;
  hiddenPasswords = false;
  registerErr: {
    err: boolean;
    message?: string;
  };

  // pass1: string; pass2: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private http: HttpClient,
    private logger: LoggingService,
    private socialAuthService: AuthService,
    private error: ErrorService,
    private loadingService: LoadingService,
    private messages: MessagesService,
    private authenticationService: AuthenticationService) {

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required]]
    });
    this.registerErr = { err: false };

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/user';
  }

  ngOnInit() {
    this.registerForm.valueChanges.subscribe(
      value => {
        if (value.confirmPassword !== value.password) {
          this.registerForm.setErrors({ passwordsMissmatch: true });
        }
      }
    );

    this.userService.role$.subscribe(
      role => this.role = role
    );

    this.socialAuthService.authState.subscribe(
      (user) => {
        if (user != null && this.loading === true) {
          this.loading = false;
          this.hiddenPasswords = true;
          this.socialUser = user;
          localStorage.clear();
          localStorage.setItem('socialUser', JSON.stringify(user));
          this.registerForm.patchValue({
            name: user.name,
            password: user.name,
            confirmPassword: user.name,
            email: user.email
          });
          this.registerRequest = {
            client_id: environment.clientId,
            client_secret: environment.clientSecret,
            username: this.registerForm.value.name,
            password: this.registerForm.value.password,
            email: this.registerForm.value.email,
            provider: this.authenticationService.authProvider,
            social_id: user.id
          };
          this.register();
        }
        this.loadingService.loadingOff();
      }
    );

  }

  register() {
    this.loading = true;
    this.loadingService.loadingOn();
    this.logger.log('REGISTER REQUEST: ' + JSON.stringify(this.registerRequest));
    this.http.post<any>(this.registerPath, this.registerRequest, { headers: { 'Content-type': 'application/json' } })
      .subscribe(
        (data) => {
          this.logger.log('REGISTER RAW RESPONSE:' + JSON.stringify(data));
          if (data.status_code === 200) {
            const content = JSON.parse(JSON.parse(data.content));
            const username = content.username;
            this.logger.log('REGISTER RESPONSE: ' + JSON.stringify(content));
            if (this.registerRequest.provider === 'JOBBAG') {
              this.authenticationService.signInWithJobbag(this.registerForm.value.name, this.registerForm.value.password)
                .subscribe(
                  data => {
                    // const role = this.userService.role;
                    this.logger.log('role: ' + this.role);
                    if (this.authenticationService.isLoggedIn) {
                      const user_id = this.authenticationService.getLoggedUserId();
                      this.logger.log('user_id: ' + user_id);

                      if (this.role) {
                        const createProfileURL = `/user/${user_id}/${this.role}/create-profile`;

                        this.logger.log('navegando a profile extras...');
                        this.router.navigate([createProfileURL], { queryParams: {} });
                      } else {
                        this.router.navigate(['user', user_id]); // role-select url
                      }
                    }
                  }, err => {
                    const message = `There was an error: ${err}`;
                    this.messages.showErrors(message);
                  });
            } else {
              this.authenticationService.socialLogin(this.socialUser, this.authenticationService.authProvider)
                .subscribe(
                  (response) => {
                    this.logger.log('SOCIAL LOGIN RESPONSE: ' + response);
                    if (response) {
                      // const role = this.userService.role;
                      this.logger.log('role: ' + this.role);
                      if (this.authenticationService.isLoggedIn) {
                        const user_id = this.authenticationService.getLoggedUserId();
                        this.logger.log('user_id: ' + user_id);
                        if (this.role) {
                          const createProfileURL = `/user/${user_id}/${this.role}/create-profile`;
                          this.logger.log('navegando a profile extras...');
                          this.router.navigate([createProfileURL]);
                        } else {
                          this.router.navigate(['user', user_id]);  // role-select URL
                        }
                      }
                    } else {
                      this.logger.log('isLoggedIn subscription was false.... (LoginComponent)');
                    }
                  }, err => {
                    const message = `There was an error: ${err}`;
                    this.messages.showErrors(message);
                  }
                );

            }

          } else {
            const content = (JSON.parse(data.content));
            this.registerErr = {
              err: true,
              message: content.text
            };
            this.logger.log(this.registerErr.message);
            const message = `There was an error: ${content.text}`;
            this.messages.showErrors(message);

            this.loading = false;
            this.loadingService.loadingOff();
            this.hiddenPasswords = false;
            this.router.navigate(['./'], { relativeTo: this.route });
          }

        }, err => {
          const message = `There was an error: ${err}`;
          this.messages.showErrors(message);
          this.loadingService.loadingOff();
          this.loading = false;

        });

  }

  facebookRegister() {
    this.loading = true;
    this.loadingService.loadingOn();

    this.authenticationService.authProvider = 'FACEBOOK';
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  googleRegister() {
    this.loading = true;
    this.loadingService.loadingOff();
    this.authenticationService.authProvider = 'GOOGLE';
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  jobbagRegister() {
    this.loading = true;
    this.loadingService.loadingOff();
    this.authenticationService.authProvider = 'JOBBAG';
    this.registerRequest = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      username: this.registerForm.value.name,
      password: this.registerForm.value.password,
      email: this.registerForm.value.email,
      provider: this.authenticationService.authProvider,
      social_id: null
    };

    this.register();
  }


}
