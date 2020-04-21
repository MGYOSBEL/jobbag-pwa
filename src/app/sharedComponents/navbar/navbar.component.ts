import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/user/services/user.service';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { AuthService } from 'angularx-social-login';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { UserProfile, User } from '@app/user/models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  profileExtrasUrl: string;
  loggedUser: User;
  socialUser;
  role: string;
  isLoggedIn: boolean;
  isLoggedIn$: Observable<boolean>;
  userId;
  hiddenNavbar: boolean;
  userImageUrl: string;
  activeProfile: UserProfile;
  defaultPicture: boolean;
  hasProfiles: boolean[] = [false, false]; // en la posicion 0 es si hay cliente y en la 1 si hay service provider

  navEnd: Observable<NavigationEnd>;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private socialAuthService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.navEnd = router.events.pipe(
      filter(evt => evt instanceof NavigationEnd)
    ) as Observable<NavigationEnd>;

    this.hiddenNavbar = false;
    this.defaultPicture = true;

    this.isLoggedIn$ = this.authenticationService.isLoggedIn$.asObservable();
  }

  ngOnInit() {
    this.userService.loggedUser$.subscribe(
      user => {
        if (user) {
          this.loggedUser = user;
          this.hasProfiles = [
            !!this.loggedUser.profiles.find(profile => profile.userProfileType === 'CLIENT'),
            !!this.loggedUser.profiles.find(profile => profile.userProfileType === 'SERVICE_PROVIDER'),
          ];
          console.log(this.hasProfiles);
        }
      }
    );

    this.navEnd.subscribe(
      evt => {
        this.role = this.userService.role;
        this.hiddenNavbar = this.router.url.includes('auth') || this.router.url.includes('create-profile')
                            || !this.role;
        this.isLoggedIn = this.authenticationService.isLoggedIn;
        if (this.authenticationService.isLoggedIn) {
          this.socialUser = JSON.parse(localStorage.getItem('socialUser'));
          this.userId = this.authenticationService.getLoggedUserId();
          this.activeProfile = this.loggedUser.profiles.find(profile => profile.userProfileType === this.role);
          if (this.activeProfile) {
            this.defaultPicture = !this.activeProfile.picture.includes('uploads');
            this.userImageUrl = environment.serverBaseURL + '/' + this.activeProfile.picture;
            console.log('defaultPicture: ', this.defaultPicture, 'userImageUrl: ', this.userImageUrl);
            }


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
    this.userService.role = 'SERVICE_PROVIDER';
    this.router.navigateByUrl(`/user/${this.loggedUser.id}/SERVICE_PROVIDER`);
  }

  toClient() {
    this.userService.role = 'CLIENT';
    this.router.navigateByUrl(`/user/${this.loggedUser.id}/CLIENT`);
  }

  createProvider() {
    this.userService.role = 'SERVICE_PROVIDER';
    this.router.navigateByUrl(`/user/${this.loggedUser.id}/SERVICE_PROVIDER/create-profile`);
  }

  createClient() {
    this.userService.role = 'CLIENT';
    this.router.navigateByUrl(`/user/${this.loggedUser.id}/CLIENT/create-profile`);
  }

}
