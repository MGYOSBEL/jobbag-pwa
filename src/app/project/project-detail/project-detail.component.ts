import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
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
export class ProjectDetailComponent implements OnInit, OnDestroy {

  @Input()
  project: Project;
  @Input()
  role: string;

  @Output()
  goBack = new EventEmitter();

  @Input()
  isInterest$: Observable<boolean>;

  @Output()
  action = new EventEmitter<
    {
      projectId: number,
      action: 'APPLY' | 'START' | 'FINISH' | 'CANCEL' | 'BRIEFCASE' | 'FINISH_CLIENT' | 'CANCEL_CLIENT'
    }>();

  actionSelected: string;
  countries: Country[];
  services: Service[];
  // projectOwner: boolean = true;
  canApply: boolean;
  canStart: boolean;
  divisionsName: string[] = [];
  servicesName: string[] = [];

  constructor(
    private route: ActivatedRoute, // toEdit
    private router: Router, // toEdit
    private personalProjectService: PersonalProjectService,
    private countryService: CountryService,
    private servicesService: ServicesService
  ) { }

  ngOnInit() {
    this.countryService.get().subscribe(
      countries => {
        this.countries = countries;
        this.divisionsName = this.getDivisionsName(this.project.divisions);
      }
    );

    this.servicesService.getAll().subscribe(
      services => {
        this.services = services;
        this.servicesName = this.getServicesName(this.project.services);
      }
    );

    if (!!this.isInterest$) {
      this.isInterest$.subscribe(
        isInterest => {
          this.canApply = !isInterest;
          this.canStart = isInterest;
        }
      );

    }
  }

  ngOnDestroy() {
  }

  backToList() {
    // this.personalProjectService.backToList();
    this.goBack.emit();
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
    this.router.navigateByUrl(`/project/${this.project.id}/edit`);
  }

  // isLoggedUserProjectOwner() {
  //   // if(this.project.interested_profiles === null)
  //   return true;
  // }
  onApply() {
    this.action.emit({
      projectId: this.project.id,
      action: 'APPLY'
    });
  }

  onStartProjectExecution() {
    this.action.emit({
      projectId: this.project.id,
      action: 'START'
    });
  }
  onCreateBriefcase() {
    this.action.emit({
      projectId: this.project.id,
      action: 'BRIEFCASE'
    });

  }

  onFinishProjectExecution() {
    this.action.emit({
      projectId: this.project.executionId,
      action: 'FINISH'
    });
  }
  onFinishClientProject() {
    this.action.emit({
      projectId: this.project.id,
      action: 'FINISH_CLIENT'
    });
  }
  onCancel() {
    const isClient = this.role === 'CLIENT';
    this.action.emit({
      projectId: isClient ? this.project.id : this.project.executionId,
      action: isClient ? 'CANCEL_CLIENT' : 'CANCEL'
    });

  }

  onUserCardClicked(userProfileId: number) {
    localStorage.setItem('activeProject', JSON.stringify(this.project));
    this.router.navigate(['/user/profile', userProfileId]);
  }

  selectProjectAction(){
    switch (this.actionSelected) {
      case "Apply":
        this.onApply();
        break;
      case "Start":
        this.onStartProjectExecution();
        break;
      case "Cancel":
        this.onCancel();
        break;
      case "Finish":
        this.onFinishClientProject();
        break;
      default:
        break;
    }
  }

}
