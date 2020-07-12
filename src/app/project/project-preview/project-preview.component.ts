import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CandidateProjectService } from '../services/candidate-project.service';
import { Project, ProjectState } from '../models/project.model';
import { Observable } from 'rxjs';
import { Country, DivisionElement } from '@app/user/models/country.model';
import { Service } from '@app/user/models/services.model';
import { CountryService } from '@app/user/services/country.service';
import { ServicesService } from '@app/user/services/services.service';
import { ProjectService } from '../services/project.service';
import { MessagesService } from '@app/services/messages.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'; //toEdit

@Component({
  selector: 'app-project-preview',
  templateUrl: './project-preview.component.html',
  styleUrls: ['./project-preview.component.css']
})
export class ProjectPreviewComponent implements OnInit {

  constructor(
    // private candidateProjectService: CandidateProjectService,
    private route: ActivatedRoute, //toEdit
    private router: Router, //toEdit
    private projectService: ProjectService,
    private messages: MessagesService,
    private countryService: CountryService,
    private servicesService: ServicesService
  ) { }

  @Input()
  previewProject$: Observable<Project>;
  previewProject: Project;

  @Input()
  userProfileId: number;
  @Input()
  role?: string;
  @Input()
  canApply$?: Observable<boolean>;

  @Output()
  detail = new EventEmitter<number>();
  @Output()
  apply = new EventEmitter<number>();
  @Output()
  startExecution = new EventEmitter<number>();
  @Output()
  action = new EventEmitter<{projectId: number, action: 'APPLY' | 'START' | 'FINISH' | 'CANCEL'}>();

  countries: Country[];
  services: Service[];

  divisionsName: string[] = [];
  servicesName: string[] = [];

  ngOnInit() {
    // this.previewProject$ = this.candidateProjectService.activeProject$;

    this.previewProject$.subscribe(
      project => {
        if (!!project) {
          this.previewProject = project;
          this.countryService.countries$.subscribe(
            countries => {
              this.countries = countries;
              this.divisionsName = this.getDivisionsName(this.previewProject.divisions);
            }
          );

          this.servicesService.services$.subscribe(
            services => {
              this.services = services;
              this.servicesName = this.getServicesName(this.previewProject.services);
            }
          );
        }
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

  onApply() {
    this.action.emit({
      projectId: this.previewProject.id,
      action: 'APPLY'
    });
  }

  onStartProjectExecution() {
    this.action.emit({
      projectId: this.previewProject.id,
      action: 'START'
    });
  }

  onFinishProjectExecution() {
    this.action.emit({
      projectId: this.previewProject.id,
      action: 'FINISH'
    });
  }
  onCancelProjectExecution() {
    this.action.emit({
      projectId: this.previewProject.id,
      action: 'CANCEL'
    });

  }

  viewDetails() {
    this.detail.emit(this.previewProject.id);
  }

  onEditProject() {
    this.router.navigateByUrl(`/project/${this.previewProject.id}/edit`);
  }


}
