import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core'; // i18n
import { UserService } from '@app/user/services/user.service';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { AuthService } from 'angularx-social-login';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { UserProfile, User } from '@app/user/models/user.model';
import { LoggingService } from '@app/services/logging.service';
import { NgLabelTemplateDirective } from '@ng-select/ng-select/lib/ng-templates.directive'; // i18n

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
  languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' }
  ];
  changeLanguages: any;

  constructor(
    private userService: UserService,
    private logger: LoggingService,
    private authenticationService: AuthenticationService,
    private socialAuthService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(LOCALE_ID) public localeId: string
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
          this.onUserEvent(user, this.role);
        }
      }
    );

    this.userService.role$.subscribe(
      role => {
        if (role) {
          this.onUserEvent(this.loggedUser, role);
        }
      }
    );

    this.navEnd.subscribe(
      evt => {

        this.hiddenNavbar = this.router.url.includes('auth') || this.router.url.includes('create-profile')
          || (this.router.url.includes('user') && !this.role);
      }
    );



    this.isLoggedIn$ = this.authenticationService.isLoggedIn$;
    this.isLoggedIn$.subscribe(
      loggedIn => {
        this.isLoggedIn = loggedIn;
        this.logger.log('loggedIn', loggedIn);
        if (!this.isLoggedIn) {
          console.log('navigating to this.route...');
          this.router.navigate(['./'], { relativeTo: this.route });
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
    this.router.navigate([`/user/${this.loggedUser.id}/SERVICE_PROVIDER/create-profile`], { queryParams: { btnhidder: true } });
  }

  createClient() {
    this.userService.role = 'CLIENT';
    this.router.navigate([`/user/${this.loggedUser.id}/CLIENT/create-profile`], { queryParams: { btnhidder: true } });
  }

  // Function that reacts to any change in loggedUser
  onUserEvent(user?: User, role?: string) {
    if (user) {
      this.loggedUser = user;
      this.hasProfiles = [
        !!(user.profiles.find(profile => profile.userProfileType === 'CLIENT')),
        !!(user.profiles.find(profile => profile.userProfileType === 'SERVICE_PROVIDER')),
      ];
      this.logger.log(this.hasProfiles);
    }
    if (role) {
      this.role = role;
    }

    if (this.isLoggedIn) {
      this.socialUser = JSON.parse(localStorage.getItem('socialUser'));
      this.userId = this.authenticationService.getLoggedUserId();
      this.activeProfile = this.loggedUser.profiles.find(profile => profile.userProfileType === this.role);
      if (this.activeProfile) {
        this.defaultPicture = this.activeProfile.picture == null;
        this.userImageUrl = environment.serverBaseURL + '/' + this.activeProfile.picture;
        this.logger.log('defaultPicture: ', this.defaultPicture, 'userImageUrl: ', this.userImageUrl);
      }
    }
  }

  // Function to reacts to any change on navigation state
  onNavigationEvent() { }

  changerLanguageRouter() {
    if (!!this.loggedUser) {
        return this.changeLanguages = `user/${this.loggedUser.id}/${this.userService.role}`;
      }
  }

}
