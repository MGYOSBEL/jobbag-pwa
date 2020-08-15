import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserProfile, UserProfileBriefcase } from '../models/user.model';
import { environment } from '@environments/environment';
import { Country, DivisionElement } from '../models/country.model';
import { Service } from '../models/services.model';
import { CountryService } from '../services/country.service';
import { ServicesService } from '../services/services.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { combineLatest, BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
  providers: [NgbRatingConfig] //add NgbRatingConfig

})
export class UserDetailComponent implements OnInit, OnDestroy, AfterViewInit {

  briefcaseDetailSubject = new BehaviorSubject<UserProfileBriefcase>(null);
  briefcaseDetail$ = this.briefcaseDetailSubject.asObservable();

  @Input()
  userProfile: UserProfile;

  @Output()
  briefcaseDetail = new EventEmitter<number>();
  profilePicture: string;
  apiPublic: string;
  scrollHeightSubject = new BehaviorSubject<number>(456);
  scrollSectionHeight$: Observable<number> = this.scrollHeightSubject.asObservable();
  screenWidthSubject = new BehaviorSubject<'xs' | 'md'>('md');
  screenWidth$ = this.screenWidthSubject.asObservable().pipe(
    tap(
      breakpoint => this.initialShownWorks = breakpoint === 'md' ? 8 : 2
    )
  );
  initialShownWorks: number;
  countries: Country[];
  services: Service[];
  divisionsName: any[] = [];
  servicesName: string[] = [];
  dashboardRoute: string;
  editProfileRoute: string;
  rating: number;
  profileHeaderImage: string;
  profileHeaderBgPosition: string;
  profileHeaderBgSize: string;
  showMore: boolean = true;

  constructor(
    config: NgbRatingConfig,
    private router: Router,
    private countryService: CountryService,
    private userService: UserService,
    private servicesService: ServicesService) {
    config.max = 5;
    config.readonly = true;

    this.rating = 3;

    const activeUserProfile$ = combineLatest(
      this.userService.loggedUser$,
      this.userService.role$
    );

    activeUserProfile$.subscribe(
      ([user, role]) => {
        const activeProfile = user.profiles.find(profile => profile.userProfileType === role);
        this.dashboardRoute = `/user/${user.id}/${activeProfile.userProfileType}`;
        this.editProfileRoute = `/user/${user.id}/${activeProfile.userProfileType}/edit`;
      }
    );
    document.body.style.overflow = 'overlay';
  }

  ngOnInit() {
    this.apiPublic = `${environment.serverBaseURL}/`;
    const header = this.userProfile.pictureProfileHeader;
    this.profilePicture = this.userProfile.picture != null ? `${environment.serverBaseURL}/${this.userProfile.picture}` : null;
    this.profileHeaderImage = (header == "NULL" || header == null) ?
      'url(../../../assets/img/banner2.jpg)' : `url(${environment.serverBaseURL}/${this.userProfile.pictureProfileHeader})`;
    this.profileHeaderBgPosition = (header == "NULL" || header == null) ? 'right top' : 'center top';
    this.profileHeaderBgSize = this.userProfile.pictureProfileHeader == "NULL" ? 'inherit' : 'cover';
    this.countryService.countries$.subscribe(
      countries => {
        this.countries = countries;
        this.divisionsName = this.getDivisionsName(this.userProfile.divisions);
      }
    );

    this.servicesService.services$.subscribe(
      services => {
        this.services = services;
        this.servicesName = this.getServicesName(this.userProfile.services);
      }
    );
    const breakpoint = screen.width >= 768 ? 'md' : 'xs';
    this.screenWidthSubject.next(breakpoint);

    window.addEventListener('resize', (event) => {
      const newSize = screen.width >= 768 ? 'md' : 'xs';
      this.screenWidthSubject.next(newSize);

    });

  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    const breakpoint = screen.width >= 768 ? 'md' : 'xs';
    this.screenWidthSubject.next(breakpoint);
    const container = document.getElementById('user-container');
    const banner = document.getElementById('banner-section');
    this.scrollHeightSubject.next(container.clientHeight - banner.clientHeight);

    console.log('scrollSectionHeight', container.clientHeight, banner.clientHeight, this.scrollHeightSubject.value);

    document.addEventListener('resize', () => {
      const container = document.getElementById('user-container');
      const banner = document.getElementById('banner-section');
      this.scrollHeightSubject.next(container.clientHeight - banner.clientHeight);
      console.log('scrollSectionHeight', container.clientHeight, banner.clientHeight, this.scrollHeightSubject.value);

    });

  }

  onShowMore() {
    this.showMore = !this.showMore;
    console.log('shown works', this.initialShownWorks);
  }

  getDivisionsName(projectDivisions: number[]) {
    const filtered = this.countries.map(country => {
      return {
        name: country.nameEn,
        divisions: country.divisions.filter(division => projectDivisions.includes(division.id))
      };
    });
    return filtered;
  }

  backToProjectDetail() {
    this.router.navigateByUrl(this.dashboardRoute);
  }

  closeProfile() {
    const returnURL = localStorage.getItem('returnURL');
    this.router.navigateByUrl(!!returnURL ? returnURL : this.dashboardRoute);
  }

  getServicesName(projectServices: number[]) {
    const servs = this.services.filter(service => projectServices.includes(service.id));
    return servs.map(service => service.descriptionEs);
  }

  onBriefcaseDetail(briefcaseId: number) {
    const selectedBriefcase = this.userProfile.briefcases.find(briefcase => briefcase.id === briefcaseId);
    this.briefcaseDetailSubject.next(selectedBriefcase);
  }
  onBriefcaseDetailClose() {
    this.briefcaseDetailSubject.next(null);
  }

  viewCV() {
    window.open(`${environment.serverBaseURL}/${this.userProfile.cv}`, '_blank');
  }

  ngOnDestroy() {
    document.body.style.overflow = 'scroll';
  }


}
