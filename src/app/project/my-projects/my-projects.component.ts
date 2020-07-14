import { Component, OnInit, Input } from '@angular/core';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { Project, ProjectState, ProjectAction } from '../models/project.model';
import { UserProfile } from '@app/user/models/user.model';
import { ProjectService } from '../services/project.service';
import { filter, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '@app/user/services/user.service';
import { PersonalProjectService } from '../services/personal-project.service';
import { MessagesService } from '@app/services/messages.service';
import { filterByStatus } from '../models/filters';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit {

  // showActionBar: boolean = false;
  userProfile: UserProfile;
  projects$: Observable<Project[]>;
  previewProject$: Observable<Project>;
  detailProject$: Observable<Project>;
  newProjects$: Observable<Project[]>;
  inProgressProjects$: Observable<Project[]>;
  finishedProjects$: Observable<Project[]>;
  selectedCard$: Observable<number>;
  selectAll$ = new Observable<boolean>();
  private statusFilterSubject = new BehaviorSubject<ProjectState>(null);
  currentStatus$ = this.statusFilterSubject.asObservable();
  actionBar = [
    ProjectAction.Delete,
    ProjectAction.SelectAll
  ];

  statusFilter = [];
  statusValue: string;

  constructor(
    private userService: UserService,
    private messages: MessagesService,
    private personalProjectService: PersonalProjectService,
    private router: Router
  ) {
    this.detailProject$ = personalProjectService.activeProject$;
    personalProjectService.userProfile$.subscribe(
      ([user, role]) => {
        this.personalProjectService.reset();
        this.userProfile = user.profiles.find(profile => profile.userProfileType === role);
        const actions = [
          ProjectAction.Delete,
          ProjectAction.SelectAll
        ];
        this.actionBar = this.userProfile.userProfileType === 'CLIENT' ? [ProjectAction.Create, ...actions] : actions;
        const filters = [
          ProjectState.FINISH,
          ProjectState.CANCEL
        ];
        this.statusFilter =
        this.userProfile.userProfileType === 'CLIENT' ? [ProjectState.NEW, ...filters] : [ProjectState.PROGRESS, ...filters];
        this.statusFilterSubject.next(this.statusFilter[0]);
        this.projects$ = combineLatest(this.personalProjectService.personalProjects$, this.currentStatus$).pipe(
          map(([projects, status]) => {
            return filterByStatus(projects, status);
          })
        );
      }
    );
  }

  ngOnInit() {
    this.selectedCard$ = this.personalProjectService.previewProject$.pipe(map(proj => {
      if (proj != null) {
        return proj.id;
      } else {
        return null;
      }
    }));
    this.previewProject$ = this.personalProjectService.previewProject$;
    this.personalProjectService.getPersonalProjects(this.userProfile.id);
    this.selectAll$ = this.personalProjectService.selectAll$;
    this.currentStatus$.subscribe(
      status => this.statusValue = status
    );
  }

  onProjectChecked(event) {
    // Aca deberia setear el multiselected Projects del servicio personal projects, para en caso de acciones multiples
  }

  onCardClicked(event) {
    // this.router.navigateByUrl(`/project/${event}`);
    this.personalProjectService.preview(event);
  }

  onCreate() {
    this.router.navigateByUrl('/project/create');
  }

  onApply() {

  }

  viewDetail(event) {
    this.personalProjectService.viewDetail(this.userProfile.id, event);
  }
  onBackToList() {
    this.personalProjectService.backToList();
  }

  onAction(event) {
    switch (event) {
      case ProjectAction.Create:
        this.onCreate();
        break;
      case ProjectAction.Apply:
        this.onApply();
        break;

      default:
        break;
    }
  }

  onActionBarFilters({locations, services}) {

  }

  onSelectAll(state) {
    this.personalProjectService.selectAll(state);
  }
  // Se llama cuando se da me interesa desde el preview
  onPreviewAction({ projectId, action }) {
    switch (action) {
      case 'APPLY':
        break;
      case 'START':
        break;
      case 'FINISH':
        this.finishExecution(projectId);
        break;
      case 'CANCEL':
        this.cancelExecution(projectId);
        break;
      default:
        break;
    }
  }

  finishExecution(executionId: number) {
    this.personalProjectService.updateExecution(executionId, 'FINISH').subscribe(
      () => this.messages.showMessages('You have succesfully started a project execution. You can view it in My Projects tab.'),
      err => this.messages.showErrors('There has been an error starting the project execution. Try it later.')
    );
  }

  cancelExecution(executionId: number) {
    this.personalProjectService.updateExecution(executionId, 'CANCEL').subscribe(
      () => this.messages.showMessages('You have succesfully started a project execution. You can view it in My Projects tab.'),
      err => this.messages.showErrors('There has been an error starting the project execution. Try it later.')
    );

  }

  onStatusChange(status) {
    this.statusFilterSubject.next(status);
    this.personalProjectService.preview(null);
  }

  // hideActionBar(){
  //   this.showActionBar = false;
  // }

  // showActionBarMethod(){
  //   this.showActionBar = true;
  // }
}
