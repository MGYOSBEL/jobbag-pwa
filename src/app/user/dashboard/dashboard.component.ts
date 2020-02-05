import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { logging } from 'protractor';
import { LoggingService } from '@app/services/logging.service';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'angularx-social-login';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  $loggedUser: Observable<User>;
  loggedUser: User;

  constructor(private route: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private socialAuthService: AuthService,
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
    if (this.authenticationService.authProvider === 'GOOGLE' || this.authenticationService.authProvider === 'FACEBOOK') {
      this.socialAuthService.signOut();
    }
    this.authenticationService.signOut();
    this.router.navigate(['']);
  }

}
