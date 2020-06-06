import { Component, OnInit } from '@angular/core';
import { User, UserProfile } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { logging } from 'protractor';
import { LoggingService } from '@app/services/logging.service';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from 'angularx-social-login';
import { UserProfileService } from '../services/user-profile.service';
import { filter } from 'rxjs/operators';
import { ProjectService } from '@app/project/services/project.service';
import { Project } from '@app/project/models/project.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  loggedUser$: Observable<User>;
  loggedUser: User;
  activeProfile: UserProfile;
  role: string;
  projects$: Observable<Project[]>;


  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private socialAuthService: AuthService,
    private projectService: ProjectService,
    private router: Router,
    private logging: LoggingService) {

      this.loggedUser$ = this.userService.loggedUser$;
      this.userService.role$.subscribe(role => {
        this.role = role;
        if (!! this.loggedUser) {
          this.activeProfile = this.loggedUser.profiles.find(profile => profile.userProfileType === this.role);
        }
      });
  }

  ngOnInit() {
    this.route.data
      .subscribe((data: { user: User }) => {
        this.loggedUser = data.user;
      });
    this.router.events.pipe(
      filter(evt => evt instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.loggedUser) {
        this.activeProfile = this.loggedUser.profiles.find(profile => profile.userProfileType === this.role);
        }
    }
    );
    this.loggedUser$.subscribe(user => {
      this.loggedUser = user;
      if (!! this.loggedUser) {
        this.activeProfile = this.loggedUser.profiles.find(profile => profile.userProfileType === this.role);
      }
    });
    this.projects$ = this.projectService.getAllProjectSummariesByProfileId(this.activeProfile.id);
    // this.projects$ = this.projectService.projects$;
    this.router.navigate([`/user/${this.loggedUser.id}/${this.role}`]);

  }

  logOut() {
    if (this.authenticationService.authProvider === 'GOOGLE' || this.authenticationService.authProvider === 'FACEBOOK') {
      this.socialAuthService.signOut();
    }
    this.authenticationService.signOut();
    this.router.navigate(['']);
  }

}
