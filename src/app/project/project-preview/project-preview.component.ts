import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Project, ProjectState } from '../models/project.model';
import { Observable } from 'rxjs';
import { Country, DivisionElement } from '@app/user/models/country.model';
import { Service } from '@app/user/models/services.model';
import { CountryService } from '@app/user/services/country.service';
import { ServicesService } from '@app/user/services/services.service';
import { ProjectService } from '../services/project.service';
import { MessagesService } from '@app/services/messages.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'; // toEdit
import { UserService } from '@app/user/services/user.service';

@Component({
  selector: 'app-project-preview',
  templateUrl: './project-preview.component.html',
  styleUrls: ['./project-preview.component.css']
})
export class ProjectPreviewComponent implements OnInit {

  @Input()
  previewProject$: Observable<Project>;
  previewProject: Project;

  @Input()
  userProfileId: number;
  role: string;
  @Input()
  isInterest$?: Observable<boolean>;

  @Output()
  detail = new EventEmitter<number>();
  @Output()
  apply = new EventEmitter<number>();
  @Output()
  startExecution = new EventEmitter<number>();
  @Output()
  action = new EventEmitter<
    {
      projectId: number,
      action: 'APPLY' | 'START' | 'FINISH' | 'CANCEL' | 'BRIEFCASE' | 'FINISH_CLIENT' | 'CANCEL_CLIENT'
    }>();

  countries: Country[];
  services: Service[];
  canApply: boolean;
  canStart: boolean;
  divisionsName: string[] = [];
  servicesName: string[] = [];
  actionSelected: string;

  constructor(
    // private candidateProjectService: CandidateProjectService,
    private route: ActivatedRoute, // toEdit
    private router: Router, // toEdit
    private userService: UserService,
    private projectService: ProjectService,
    private messages: MessagesService,
    private countryService: CountryService,
    private servicesService: ServicesService
  ) {
  }



  ngOnInit() {
    if (!!this.isInterest$) {
      this.isInterest$.subscribe(
        isInterest => {
          this.canApply = !isInterest;
          this.canStart = isInterest;
        }
      );
    }
    this.userService.role$.subscribe(
      role => this.role = role
    );
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
    const divisions: DivisionElement[] = [];
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
  onCreateBriefcase() {
    this.action.emit({
      projectId: this.previewProject.id,
      action: 'BRIEFCASE'
    });

  }

  onFinishProjectExecution() {
    this.action.emit({
      projectId: this.previewProject.executionId,
      action: 'FINISH'
    });
  }
  onFinishClientProject() {
    this.action.emit({
      projectId: this.previewProject.id,
      action: 'FINISH_CLIENT'
    });
  }
  onCancel() {
    const isClient = this.role === 'CLIENT';
    this.action.emit({
      projectId: isClient ? this.previewProject.id : this.previewProject.executionId,
      action: isClient ? 'CANCEL_CLIENT' : 'CANCEL'
    });

  }

  viewDetails() {
    this.detail.emit(this.previewProject.id);
  }

  onEditProject() {
    this.router.navigateByUrl(`/project/${this.previewProject.id}/edit`);
  }

  selectProjectAction() {
    switch (this.actionSelected) {
      case 'Apply':
        this.onApply();
        break;
      case 'Start':
        this.onStartProjectExecution();
        break;
      case 'Cancel':
        this.onCancel();
        break;
      case 'Finish':
        this.onFinishClientProject();
        break;
      default:
        break;
    }
  }




}
