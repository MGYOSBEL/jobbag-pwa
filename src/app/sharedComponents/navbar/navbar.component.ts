import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/user/services/user.service';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { AuthService } from 'angularx-social-login';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ActiveProfileService } from '@app/user/services/active-profile.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  profileExtrasUrl: string;
  loggedUser;
  socialUser;
  isLoggedIn: boolean;
  isLoggedIn$: Observable<boolean>;
  userId;
  hiddenNavbar: boolean;
  userImageUrl: string;

  navEnd: Observable<NavigationEnd>;

  constructor(private userService: UserService,
              private authenticationService: AuthenticationService,
              public activeProfileService: ActiveProfileService,
              private socialAuthService: AuthService,
              private router: Router
              ) {
    this.navEnd = router.events.pipe(
      filter(evt => evt instanceof NavigationEnd)
    ) as Observable<NavigationEnd>;
    this.userId = this.authenticationService.getLoggedUserId();
    // this.userService.get(this.userId).subscribe(
    //   user => this.loggedUser = user
    // );
    this.hiddenNavbar = false;

    this.isLoggedIn$ = this.authenticationService.isLoggedIn$.asObservable();
  }

  ngOnInit() {
    this.navEnd.subscribe(
      evt => {
        this.hiddenNavbar = this.router.url.includes('auth');
        this.isLoggedIn = this.authenticationService.isLoggedIn;
        if (this.authenticationService.isLoggedIn) {
          this.socialUser = JSON.parse(localStorage.getItem('socialUser'));
          this.userImageUrl = environment.serverBaseURL + '/' + this.activeProfileService.activeProfile.picture;
          this.userId = this.authenticationService.getLoggedUserId();
          this.userService.get(this.userId).subscribe(
            user => this.loggedUser = user
          );
        }
      }
    );


  }

  signout() {
    if (this.authenticationService.authProvider === 'GOOGLE' || this.authenticationService.authProvider === 'FACEBOOK') {
      this.socialAuthService.signOut();
    }
    this.authenticationService.signOut();
    this.isLoggedIn = false;
    this.router.navigate(['']);
  }

  toServiceProvider() {
    this.activeProfileService.activateServiceProvider();
  }

  toClient() {
    this.activeProfileService.activateClient();
  }

}
