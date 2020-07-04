import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { Observable } from 'rxjs';
import { PersonalProjectService } from '../services/personal-project.service';
import { ServicesService } from '@app/user/services/services.service';
import { CountryService } from '@app/user/services/country.service';
import { Country, DivisionElement } from '@app/user/models/country.model';
import { Service } from '@app/user/models/services.model';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'; //toEdit

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  @Input()
  project: Project;

  countries: Country[];
  services: Service[];
  projectOwner: boolean = true;

  constructor(
    private route: ActivatedRoute, //toEdit
    private router: Router, //toEdit
    private personalProjectService: PersonalProjectService,
    private countryService: CountryService,
    private servicesService: ServicesService
  ) { }

  ngOnInit() {
    this.countryService.get().subscribe(
      countries => this.countries = countries
    );

    this.servicesService.getAll().subscribe(
      services => this.services = services
    );
    this.projectOwner = this.getProjectOwner();
  }

  backToList() {
    this.personalProjectService.backToList();
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

  onEditProject() {
    this.router.navigateByUrl(`/project/id/edit`);
  }

  getProjectOwner(){
    // if(this.project.interested_profiles === null)
    return true;
  }

}
