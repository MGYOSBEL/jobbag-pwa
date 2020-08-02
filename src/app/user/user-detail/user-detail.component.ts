import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserProfile } from '../models/user.model';
import { environment } from '@environments/environment';
import { Country, DivisionElement } from '../models/country.model';
import { Service } from '../models/services.model';
import { CountryService } from '../services/country.service';
import { ServicesService } from '../services/services.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
  providers: [NgbRatingConfig] //add NgbRatingConfig

})
export class UserDetailComponent implements OnInit {

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
    this.profilePicture = `${environment.serverBaseURL}/${this.userProfile.picture}`;
    this.profileHeaderImage = this.userProfile.pictureProfileHeader == "NULL" ?
    'url(../../../assets/img/black-green.png)' : `url(${environment.serverBaseURL}/${this.userProfile.pictureProfileHeader})`;
    console.log('header => ', this.profileHeaderImage);
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
    this.briefcaseDetail.emit(briefcaseId);
  }

  viewCV() {
    window.open(`${environment.serverBaseURL}/${this.userProfile.cv}`, '_blank');
  }


}
