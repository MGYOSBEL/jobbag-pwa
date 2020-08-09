import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserProfile, UserProfileBriefcase } from '../models/user.model';
import { environment } from '@environments/environment';
import { Country, DivisionElement } from '../models/country.model';
import { Service } from '../models/services.model';
import { CountryService } from '../services/country.service';
import { ServicesService } from '../services/services.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { combineLatest, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
  providers: [NgbRatingConfig] //add NgbRatingConfig

})
export class UserDetailComponent implements OnInit {

  briefcaseDetailSubject = new BehaviorSubject<UserProfileBriefcase>(null);
  briefcaseDetail$ = this.briefcaseDetailSubject.asObservable();

  @Input()
  userProfile: UserProfile;

  @Output()
  briefcaseDetail = new EventEmitter<number>();
  profilePicture: string;
  apiPublic: string;

  countries: Country[];
  services: Service[];
  divisionsName: any[] = [];
  servicesName: string[] = [];
  dashboardRoute: string;
  rating: number;
  profileHeaderImage: string;
  profileHeaderBgPosition: string;
  profileHeaderBgSize: string;

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
      }
    );

  }

  ngOnInit() {
    this.apiPublic = `${environment.serverBaseURL}/`;
    this.profilePicture = this.userProfile.picture != null ? `${environment.serverBaseURL}/${this.userProfile.picture}` : null;
    this.profileHeaderImage = this.userProfile.pictureProfileHeader == "NULL" ?
      'url(../../../assets/img/banner2.jpg)' : `url(${environment.serverBaseURL}/${this.userProfile.pictureProfileHeader})`;
    this.profileHeaderBgPosition = this.userProfile.pictureProfileHeader == "NULL" ? 'right top' : 'center center';
    this.profileHeaderBgSize = this.userProfile.pictureProfileHeader == "NULL" ? 'contain' : 'cover';
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


}
