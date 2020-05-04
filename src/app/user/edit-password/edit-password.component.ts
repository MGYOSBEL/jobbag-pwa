import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { LoadingService } from '@app/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MessagesService } from '@app/services/messages.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css']
})
export class EditPasswordComponent implements OnInit {

  passwordForm: FormGroup;

  loggedUser: User;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private loading: LoadingService,
    private messages: MessagesService
  ) {
    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required],
      newPassword: ['', [ Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [ Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit() {
    this.passwordForm.valueChanges.subscribe(
      value => {
        if (value.newPassword !== value.confirmPassword) {
          this.passwordForm.setErrors({ passwordsMissmatch: true });
        }
      }
    );

    this.loggedUser = this.userService.loggedUser;

  }

  submit() {
    console.log(this.passwordForm.value);
    const editUserRequest = {
      id: this.loggedUser.id,
      username: this.loggedUser.username,
      password: this.passwordForm.value.newPassword,
      email: this.loggedUser.email
    };
    const request$ = this.userService.edit(editUserRequest);

    this.loading.showLoaderUntilCompletes(request$).subscribe(
      () => this.router.navigate(['../CLIENT'], {relativeTo: this.route}),
      err => this.messages.showErrors(err)
    );
  }

}
