import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { LoggingService } from '@app/services/logging.service';
import { SocialUser } from 'angularx-social-login';
import { User } from '@app/user/models/user.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = new FormControl('');
  password = new FormControl('');
  loginForm: FormGroup;
  returnUrl: string;




  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private logging: LoggingService) {

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/user';
  }

  jobbagLogin() {
    this.authenticationService.signInWithJobbag(this.email.value, this.password.value)
        .subscribe( data =>  {
          if (this.authenticationService.isLoggedIn) {
            const user_id = JSON.parse(JSON.parse(localStorage.getItem('bearerToken')).content).user_id;
            this.router.navigate([this.returnUrl, user_id ]);
          }
        }, (error) => {
          this.router.navigate(['/error']);
          this.logging.log('error on the post request of the login method: ' + error + ' ... (LoginComponent)');
        });
  }

  facebookLogin() {
    this.authenticationService.signInWithFB().subscribe(
      (user) => {
        if (user != null ) {
          const user_id = JSON.parse(JSON.parse(localStorage.getItem('bearerToken')).content).user_id;
          console.log('facebookLogin - user_id: ' + user_id);
          console.log('facebookLogin - returnUrl: ' + this.returnUrl);
          this.router.navigate([this.returnUrl, user_id]);
        } else {
          this.logging.log('isLoggedIn subscription was false.... (LoginComponent)');
        }
      }
    );
  }

  googleLogin() {
    this.authenticationService.signInWithGoogle()
    .subscribe(
      (response) => {
        this.logging.log('googleLogin - entering signInWithGoogle subscribe callback');
        if (response.status === 200 ) {
          const user_id = JSON.parse(JSON.parse(localStorage.getItem('bearerToken')).content).user_id;
          console.log('googleLogin - user_id: ' + user_id);
          console.log('googleLogin - returnUrl: ' + this.returnUrl);
          this.router.navigate([this.returnUrl, user_id]);
        } else {
          this.logging.log('isLoggedIn subscription was false.... (LoginComponent)');
        }
      }
    );


  }

  ngOnInit() {

  }

}
