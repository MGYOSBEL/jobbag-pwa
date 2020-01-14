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
import { LoggingService } from '../logging.service';
import { SocialUser } from 'angularx-social-login';
import { User } from '@app/models/user.model';


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

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  onSubmit() {
    this.logging.log('submitting the form... (LoginComponent)');
    this.authenticationService.signInWithJobbag(this.email.value, this.password.value)
        .subscribe( data =>  {
          if (this.authenticationService.isLoggedIn) {
            this.logging.log('Callback method for the login. isLoggedIn==true, so navigating to dashboard... (LoginComponent)');
            this.router.navigate([this.returnUrl]);
          }
        }, (error) => {
          // this.router.navigate(['']);
          this.logging.log('error on the post request of the login method: ' + error + ' ... (LoginComponent)');
        });
  }

  facebookLogin() {
    this.authenticationService.signInWithFB();
  }

  googleLogin() {
    this.authenticationService.signInWithGoogle().subscribe (
      (user) => {
        if (user != null ) {
          console.log('isLoggedIn subscription was true. Lets router navigate.... (LoginComponent)');
          this.router.navigate([this.returnUrl]);
        } else {
          console.log('isLoggedIn subscription was false.... (LoginComponent)');
        }
      }
    );
    // this.router.navigate([this.returnUrl]);
  }

  loginCallback( data: any ) {
    this.logging.log('object on the post callback: ' + data + ' ... (LoginComponent)');
    this.email.setValue('');
    this.password.setValue('');


  }

  ngOnInit() {

  }

}
