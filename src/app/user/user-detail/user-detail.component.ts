import { Component, OnInit, Input } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserProfile } from '../models/user.model';
import { environment } from '@environments/environment';
import { Country, DivisionElement } from '../models/country.model';
import { Service } from '../models/services.model';
import { CountryService } from '../services/country.service';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
  providers: [NgbRatingConfig] //add NgbRatingConfig

})
export class UserDetailComponent implements OnInit {

  @Input()
  userProfile: UserProfile;
  profilePicture: string;
  apiPublic: string;

  countries: Country[];
  services: Service[];
  divisionsName: string[] = [];
  servicesName: string[] = [];

  rating: number;

  constructor(
    config: NgbRatingConfig,
    private countryService: CountryService,
    private servicesService: ServicesService) {
    config.max = 5;
    config.readonly = true;

    this.rating = 3;
   }

  ngOnInit() {
    this.apiPublic = `${environment.serverBaseURL}/`;
    this.profilePicture = `${environment.serverBaseURL}/${this.userProfile.picture}`;

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
    let divisions: DivisionElement[] = [];
    this.countries.forEach(country => divisions.push(...country.divisions));
    const filtered = divisions.filter(division => projectDivisions.includes(division.id));
    return filtered.map(division => division.nameEs) || [];
  }

  getServicesName(projectServices: number[]) {
    const servs = this.services.filter(service => projectServices.includes(service.id));
    return servs.map(service => service.descriptionEs);
  }


}
