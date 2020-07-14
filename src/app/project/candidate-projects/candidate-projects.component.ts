import { Component, OnInit, Input } from '@angular/core';
import { CandidateProjectService } from '../services/candidate-project.service';
import { Observable, of, combineLatest, observable, BehaviorSubject } from 'rxjs';
import { Project, ProjectAction, ProjectState } from '../models/project.model';
import { MessagesService } from '@app/services/messages.service';
import { UserProfile } from '@app/user/models/user.model';
import { UserProfileService } from '@app/user/services/user-profile.service';
import { UserService } from '@app/user/services/user.service';
import { Router } from '@angular/router';
import { map, filter, tap } from 'rxjs/operators';
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
  projectList$: Observable<Project[]>; // Lista de projects despues de ser filtrados
  projects$: Observable<Project[]>; // lista de Projects antes de ser filtrados

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
  statusFilter: string[] = ['ALL', 'CANDIDATES', 'APPLIED'];
  statusValue: string;
  locationFilterSubject = new BehaviorSubject<number[]>([]);
  serviceFilterSubject = new BehaviorSubject<number[]>([]);
  locationFilter$: Observable<number[]> = this.locationFilterSubject.asObservable();
  servicesFilter$: Observable<number[]> = this.serviceFilterSubject.asObservable();
  currentStatusSubject = new BehaviorSubject<string>(this.statusFilter[0]);
  currentStatusFilter$: Observable<string> = this.currentStatusSubject.asObservable();
  currentStatusFilter: string;
  selectedCard$: Observable<number>;

  constructor(
    private userService: UserService,
    private candidateProjectService: CandidateProjectService,
    private messages: MessagesService,
    private router: Router
  ) {
    this.selectedCard$ = this.candidateProjectService.previewProject$.pipe(map(proj => {
      if (proj != null) {
        return proj.id;
      } else {
        return null;
      }
    }));
    this.currentStatusFilter = this.statusFilter[0];
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
        this.locationFilterSubject.next(this.userProfile.divisions);
        this.serviceFilterSubject.next(this.userProfile.services);
      }
    );
  }

  ngOnInit() {
    this.currentStatusFilter$.subscribe(
      status => this.currentStatusFilter = status
    );
    this.projects$ = combineLatest(
      this.candidateProjectService.interestProjects$,
      this.candidateProjectService.candidateProjects$,
      this.currentStatusFilter$)
      .pipe(
        map(([interests, candidates, status]) => this.filterProjectsByStatus(interests, candidates, status)),
      );
    this.projectList$ = combineLatest(
      this.projects$,
      this.locationFilter$,
      this.servicesFilter$
    ).pipe(
      map(([projects, locationFilter, servicesFilter]) => {
        const filteredByLocations = filterByLocation(projects, locationFilter);
        const filteredByServices = filterByService(filteredByLocations, servicesFilter);
        return filteredByServices;
      }),
    );
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

  onActionBarFilter({ locations, services }) {
    if (!!locations) {
      this.locationFilterSubject.next(locations);
    }
    if (!!services) {
      this.serviceFilterSubject.next(services);
    }
  }
  // Filtrar proyectos por estado
  filterProjectsByStatus(interests: Project[], candidates: Project[], status: string) {
    switch (status) {
      case this.statusFilter[1]:
        return [...candidates];
        break;
      case this.statusFilter[2]:
        return [...interests];
        break;
      case this.statusFilter[0]:
        return [...interests, ...candidates];
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
  onStatusChange(status) {
    this.resetSelectedCard();
    this.currentStatusSubject.next(status);
  }
  resetSelectedCard() {
    this.candidateProjectService.preview(null);
  }

  onDivisionsSelect(event) {
    this.selectedDivisionsFilter = event;
  }
}
