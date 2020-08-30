import { Component, OnInit } from '@angular/core';
import { User, UserProfile } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Observable, combineLatest } from 'rxjs';
import { logging } from 'protractor';
import { LoggingService } from '@app/services/logging.service';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { Router, ActivatedRoute, NavigationEnd, ɵangular_packages_router_router_j } from '@angular/router';
import { AuthService } from 'angularx-social-login';
import { UserProfileService } from '../services/user-profile.service';
import { filter } from 'rxjs/operators';
import { ProjectService } from '@app/project/services/project.service';
import { Project } from '@app/project/models/project.model';
import { JsonPipe } from '@angular/common';
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
  activeTab: string = 'navHome';
  user$: Observable<[User, string]>;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private socialAuthService: AuthService,
    private projectService: ProjectService,
    private router: Router,
    private logging: LoggingService) {

    this.obtainActiveTab();
    this.role = route.snapshot.params.role;
  }

  ngOnInit() {
    this.user$ = combineLatest(
      this.userService.loggedUser$,
      this.userService.role$
    );

    this.user$.subscribe(
      ([user, role]) => {
        if (!!user) {
          this.loggedUser = user;
        }
        if (!!role) {
          this.role = role;
        }
        this.activeProfile = this.loggedUser.profiles.find(profile => profile.userProfileType === this.role);
      }
    );

    this.router.events.pipe(
      filter(evt => evt instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.loggedUser) {
        this.activeProfile = this.loggedUser.profiles.find(profile => profile.userProfileType === this.role);
      }
    }
    );
    // this.router.navigate([`/user/${this.loggedUser.id}/${this.role}`]);

    this.obtainActiveTab();
  }

  onCreateProject() {
    this.router.navigateByUrl('/project/create');
  }

  logOut() {
    if (this.authenticationService.authProvider === 'GOOGLE' || this.authenticationService.authProvider === 'FACEBOOK') {
      this.socialAuthService.signOut();
    }
    this.authenticationService.signOut();
    this.router.navigate(['']);
  }

  saveActiveTab(activeTab) {
    this.activeTab = activeTab;
    localStorage.setItem('activeTab', this.activeTab);
  }

  obtainActiveTab() {
    const savedTab = localStorage.getItem('activeTab');
    this.activeTab = !!savedTab ? savedTab : 'navHome';
  }



}
