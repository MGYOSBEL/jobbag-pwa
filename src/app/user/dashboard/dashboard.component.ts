import { Component, OnInit } from '@angular/core';
import { User, UserProfile } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { logging } from 'protractor';
import { LoggingService } from '@app/services/logging.service';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'angularx-social-login';
import { ActiveProfileService } from '../services/active-profile.service';
import { UserProfileService } from '../services/user-profile.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  $loggedUser: Observable<User>;
  loggedUser: User;
  activeProfile: UserProfile;

  constructor(private route: ActivatedRoute,
              public activeProfileService: ActiveProfileService,
              private userProfileService: UserProfileService,
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
    this.activeProfileService.activeProfileType$.subscribe(
      profileType => {
        this.activeProfile = profileType === 'CLIENT' ? this.userProfileService.client : this.userProfileService.serviceProvider;
      }
    );

  }

  logOut() {
    if (this.authenticationService.authProvider === 'GOOGLE' || this.authenticationService.authProvider === 'FACEBOOK') {
      this.socialAuthService.signOut();
    }
    this.authenticationService.signOut();
    this.router.navigate(['']);
  }

}
