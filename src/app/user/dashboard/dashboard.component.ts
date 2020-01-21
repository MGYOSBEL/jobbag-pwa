import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { logging } from 'protractor';
import { LoggingService } from '@app/logging.service';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  $loggedUser: Observable<User>;
  loggedUser: User;
  constructor(private userService: UserService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private logging: LoggingService) {
  }

  ngOnInit() {
    this.logging.log('initiating dashboard (DashboardComponent)');
    this.$loggedUser = this.userService.getUser();
    // this.$loggedUser.subscribe(
    this.logging.log('Subscribing to get<User> observable and waiting for the response..... (DashboardComponent)');
    this.$loggedUser
      .subscribe(
        (data: User) => {
        this.loggedUser = { ...data };
          // this.loggedUser = {
          //   username: data['username'],
          //   username_canonical: data['username'],
          //   email: data['email'],
          //   email_canonical: data['email_canonical'],
          //   id: data['id'],
          //   groups: data['groups'],
          //   roles: data['roles'],
          //   enabled: data['enabled'],
          //   salt: data['salt'],
          //   password: data['password']
          // };
          // this.logging.log(data);
        this.logging.log('Printing loggedUser in the getUser callback routine... (DashboardComponent)');
        console.log(this.loggedUser);
        }
      );
  }

  logOut() {
    this.authenticationService.signOut();
    this.router.navigate(['']);
  }

}
