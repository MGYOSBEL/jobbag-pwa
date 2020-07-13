import { Component, OnInit, Input } from '@angular/core';
import { CandidateProjectService } from '../services/candidate-project.service';
import { Observable, of, combineLatest } from 'rxjs';
import { Project, ProjectAction, ProjectState } from '../models/project.model';
import { MessagesService } from '@app/services/messages.service';
import { UserProfile } from '@app/user/models/user.model';
import { UserProfileService } from '@app/user/services/user-profile.service';
import { UserService } from '@app/user/services/user.service';
import { Router } from '@angular/router';
import { map, filter } from 'rxjs/operators';
import { filterByLocation, filterByService } from '../models/filters';

@Component({
  selector: 'app-candidate-projects',
  templateUrl: './candidate-projects.component.html',
  styleUrls: ['./candidate-projects.component.css'],
  providers: [CandidateProjectService]
})
export class CandidateProjectsComponent implements OnInit {

  userProfile: UserProfile;
  selectedDivisionsFilter: number[] = [];
  projectList$: Observable<Project[]>;

  candidateProjects$: Observable<Project[]>;
  interestProjects$: Observable<Project[]>;
  selectedCandidates$: Observable<number[]>;
  selectAll$ = new Observable<boolean>();
  previewProject$: Observable<Project>;
  detailProject$: Observable<Project>;
  masterSelected$: Observable<boolean>;
  canPreviewApply$: Observable<boolean>;
  canMultiselectedApply$: Observable<boolean>;
  actionBar = [ProjectAction.Apply, ProjectAction.Delete, ProjectAction.SelectAll];
  statusFilter = ['MIXED', ProjectState.NEW, 'INTEREST'];
  locationFilter: number[];
  servicesFilter: number[];
  currentStatusFilter: string;

  constructor(
    private userService: UserService,
    private candidateProjectService: CandidateProjectService,
    private messages: MessagesService,
    private router: Router
  ) {
    this.projectList$ = this.candidateProjects$;
    this.canMultiselectedApply$ = of(false);
    this.masterSelected$ = this.candidateProjectService.selectAll$;
    this.selectedCandidates$ = this.candidateProjectService.multiSelectedProjects$;
    const userProfile$ = combineLatest(
      userService.loggedUser$,
      userService.role$
    );
    userProfile$.subscribe(
      ([user, role]) => {
        this.userProfile = user.profiles.find(profile => profile.userProfileType === role);
        this.locationFilter = this.userProfile.divisions;
        this.servicesFilter = this.userProfile.services;
      }
    );
  }

  ngOnInit() {
    this.projectList$ = combineLatest(this.candidateProjectService.interestProjects$, this.candidateProjectService.candidateProjects$)
      .pipe(
        map(([interests, candidates]) => [...interests, ...candidates]),
        map(projects => filterByLocation(projects, this.locationFilter)));
    this.previewProject$ = this.candidateProjectService.previewProject$;
    this.detailProject$ = this.candidateProjectService.activeProject$;
    this.candidateProjectService.loadCandidatesByUserProfileId(this.userProfile.id);

    this.previewProject$.subscribe(
      project => {
        if (project != null) {
          const canApply = !this.candidateProjectService.isInterest(project.id);
          this.canPreviewApply$ = of(canApply);
        }
      }
    );
  }

  onSelectAll(state) {
    this.candidateProjectService.selectAll(state);
  }

  onCardClicked(event) {
    this.candidateProjectService.preview(event);
  }

  onSelectProjects(event) {
    this.candidateProjectService.setMultiSelected(event);
    const canApply = this.candidateProjectService.canApplyMultipleProjects(event);
    this.canMultiselectedApply$ = of(canApply);
  }

  onActionBarFilter({ status, locations }) {
    if (!!locations) {
      this.locationFilter = locations;
    }
    this.filterProjectsByStatus(!!status ? status : this.currentStatusFilter);
    this.candidateProjectService.preview(null);
  }
  // Filtrar proyectos por estado
  filterProjectsByStatus(status) {
    this.currentStatusFilter = status;
    switch (status) {
      case ProjectState.NEW:
        this.projectList$ = this.candidateProjectService.candidateProjects$
        .pipe(
          map(projects => filterByLocation(projects, this.locationFilter)),
          map(projects => filterByService(projects, this.servicesFilter))
          );
        break;
      case 'INTEREST':
        this.projectList$ = this.candidateProjectService.interestProjects$
        .pipe(
          map(projects => filterByLocation(projects, this.locationFilter)),
          map(projects => filterByService(projects, this.servicesFilter))
          );
        break;
      case 'MIXED':
        this.projectList$ = combineLatest(this.candidateProjectService.interestProjects$, this.candidateProjectService.candidateProjects$)
          .pipe(
            map(([interests, candidates]) => [...interests, ...candidates]));
        break;

      default:
        break;
    }
  }
  // Se llama cuando se da me interesa desde el preview
  onPreviewAction({ projectId, action }) {
    switch (action) {
      case 'APPLY':
        this.Apply([projectId]);
        break;
      case 'START':
        this.StartExecution(projectId);
        break;
      case 'FINISH':
        this.FinishExecution(projectId);
        break;
      case 'FINISH':
        this.CancelExecution(projectId);
        break;
      default:
        break;
    }
  }
  CancelExecution(projectId: number) {
    this.candidateProjectService.startExecution(projectId, this.userProfile.id).subscribe(
      () => this.messages.showMessages('You have succesfully started a project execution. You can view it in My Projects tab.'),
      err => this.messages.showErrors('There has been an error starting the project execution. Try it later.')
    );
  }
  FinishExecution(projectId: number) {
    this.candidateProjectService.startExecution(projectId, this.userProfile.id).subscribe(
      () => this.messages.showMessages('You have succesfully started a project execution. You can view it in My Projects tab.'),
      err => this.messages.showErrors('There has been an error starting the project execution. Try it later.')
    );
  }
  // Comenzar la ejecucion de un proyecto
  StartExecution(projectId) {
    this.candidateProjectService.startExecution(projectId, this.userProfile.id).subscribe(
      () => this.messages.showMessages('You have succesfully started a project execution. You can view it in My Projects tab.'),
      err => this.messages.showErrors('There has been an error starting the project execution. Try it later.')
    );
  }
  // Aplicar a un proyecto (me interesa)
  Apply(projects: number[]) {
    this.applyToCandidateProjects(projects);
  }
  // Respuesta a las acciones q se emiten desde el actionBar
  onAction(event) {
    switch (event) {
      case ProjectAction.Apply:
        const appliedCandidates = this.candidateProjectService.getMultiSelected();
        this.Apply(appliedCandidates);
        break;

      default:
        break;
    }
  }
  // Se ejecuta cuando se da click en el detail del preview
  onDetail(event) {
    this.candidateProjectService.viewDetail(this.userProfile.id, event);
  }
  // Se ejecuta cuando se regresa a la lista
  onBackToList() {
    this.candidateProjectService.backToList();
  }


  applyToCandidateProjects(projects: number[]) {
    this.candidateProjectService.registerInterest(this.userProfile.id, projects).subscribe(
      success => {
        if (success) {
          this.messages.showMessages('You have succesfuly applied to the project(s)');
        } else {
          this.messages.showErrors('Some error applying. Try again later.');
        }
      }
    );
  }


  onDivisionsSelect(event) {
    this.selectedDivisionsFilter = event;
  }
}
