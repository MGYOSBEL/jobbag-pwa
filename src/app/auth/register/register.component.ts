import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { RegisterRequest } from '../models/auth.model';
import { QueryValueType } from '@angular/compiler/src/core';
import { AuthenticationService } from '../services/authentication.service';

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

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authenticationService: AuthenticationService) {

    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/user';
  }

  ngOnInit() {
  }

  register() {
    this.registerRequest = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      username: this.name.value,
      password: this.password.value,
      email: this.email.value
    };
    console.log(this.registerRequest);
    this.http.post<any>('http://localhost/user', this.registerRequest, { headers: { 'Content-type': 'application/json' } })
      .subscribe(
        (data) => {
          const content = data.content.values;
          const username = JSON.stringify(content);
          console.log(JSON.stringify('content: ' + content));
          console.log(JSON.stringify('username: ' + username));
          this.authenticationService.signInWithJobbag('test_user', 'test').subscribe(
            data => {
              const role = this.route.snapshot.queryParams.role;
              console.log('role: ' + role);
              if (this.authenticationService.isLoggedIn) {
                const user_id = JSON.parse(JSON.parse(localStorage.getItem('bearerToken')).content).user_id;
                if (role) {
                  console.log('navegando a profile extras...');
                  this.router.navigate(['/user/' + user_id + '/profile-extras'], { queryParams: { role } });
                } else {
                  this.router.navigate(['/user/3/select-role']);
                }
              }
            });

        });

  }

  facebookLogin() {

  }

  googleLogin() {

  }

  // passwordMatchValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  //   const password = control.get('password');
  //   const confirmPassword = control.get('confirmPassword');

  //   return password && confirmPassword && password.value === confirmPassword.value ? null : { 'passwordMissMatch': true } ;
  // }

}
