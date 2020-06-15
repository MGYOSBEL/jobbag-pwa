import { Component, OnInit } from '@angular/core';
import { CandidateProjectService } from '../services/candidate-project.service';
import { Project } from '../models/project.model';
import { Observable } from 'rxjs';
import { Country, DivisionElement } from '@app/user/models/country.model';
import { Service } from '@app/user/models/services.model';
import { CountryService } from '@app/user/services/country.service';
import { ServicesService } from '@app/user/services/services.service';

@Component({
  selector: 'app-project-preview',
  templateUrl: './project-preview.component.html',
  styleUrls: ['./project-preview.component.css']
})
export class ProjectPreviewComponent implements OnInit {

  constructor(
    private candidateProjectService: CandidateProjectService,
    private countryService: CountryService,
    private servicesService: ServicesService
  ) { }

  previewProject$: Observable<Project>;

  countries: Country[];
  services: Service[];

  ngOnInit() {
    this.previewProject$ = this.candidateProjectService.activeProject$;

    this.countryService.get().subscribe(
      countries => this.countries = countries
    );

    this.servicesService.getAll().subscribe(
      services => this.services = services
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
