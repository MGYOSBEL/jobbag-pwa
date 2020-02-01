import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { logging } from 'protractor';
import { LoggingService } from '@app/services/logging.service';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  $loggedUser: Observable<User>;
  loggedUser: User;

  navItemStyles = [
    'background-color: #999999;color: white;',
    'background-color: #2688c6; color: white;'
  ];

  constructor(private route: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private router: Router,
              private logging: LoggingService) {
  }

  ngOnInit() {
    this.route.data
    .subscribe((data: {user: User}) => {
      this.loggedUser = data.user;
    });

  }

  logOut() {
    this.authenticationService.signOut();
    this.router.navigate(['']);
  }

}
