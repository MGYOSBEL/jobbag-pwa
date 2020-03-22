import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { environment } from '@environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileExtrasComponent } from '../profile-extras/profile-extras.component';
import { BriefcaseEditComponent } from '../briefcase-edit/briefcase-edit.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  @ViewChild(ProfileExtrasComponent, {static: false})
  private profileExtrasComponent: ProfileExtrasComponent;

  @ViewChild(BriefcaseEditComponent, {static: false})
  private briefcaseEditComponent: BriefcaseEditComponent;


  loggedUser: User;
  editUserForm: FormGroup;
  showPassword = false;
  editError: {
    err: boolean,
    message?: string
  };
  editOK: {
    ok: boolean,
    message?: string
  };
  loading = false;
  marked = false;
  theCheckbox = false;
  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute) {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  }

  ngOnInit() {
    this.editError = {err: false};
    this.editOK = {ok: false};
    this.loading = false;

    this.editUserForm = this.formBuilder.group({
      email: [this.loggedUser.email, [Validators.required, Validators.email]],
      name: [this.loggedUser.username, Validators.required],
      password: [''],
      confirmPassword: ['']
    });



    this.editUserForm.valueChanges.subscribe(
      value => {
        if ((value.confirmPassword !== value.password) && this.showPassword) {
          this.editUserForm.setErrors({passwordsMissmatch: true});
        }
      }
    );
  }

  editUser() {
    const requestBody = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      user: {
        id: this.loggedUser.id,
        username: this.editUserForm.value.name,
        email: this.editUserForm.value.email,
        password: this.showPassword ? this.editUserForm.value.password : null
      }
    };
    this.loading = true;
    this.userService.edit(requestBody).subscribe(
      response => {
        this.loading = false;

        this.editOK = {
          ok: true,
          message: 'Your user info was successfuly edited.'
        };
        this.router.navigate(['./'], { relativeTo: this.route });
      },
      err => {
        this.editError = {
          err: true,
          message: err.statusCode + err.text
        };
      }

    );
  }

  togglePasswords() {
    this.showPassword = !this.showPassword;
    this.editUserForm.controls['password'].setValidators(
      this.showPassword ? [Validators.required, Validators.minLength(5)] : []
    );
    this.editUserForm.controls['confirmPassword'].setValidators(
      this.showPassword ? [Validators.required] : []
    );
    this.editUserForm.controls['confirmPassword'].updateValueAndValidity();
    this.editUserForm.controls['password'].updateValueAndValidity();
    this.editUserForm.updateValueAndValidity();
  }

  toggleVisibility(e) {
    this.marked = e.target.checked;
  }

  exit() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
