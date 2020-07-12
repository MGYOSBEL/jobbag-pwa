import { Component, OnInit, Input } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Project, ProjectState, ProjectAction } from '../models/project.model';
import { UserProfile } from '@app/user/models/user.model';
import { ProjectService } from '../services/project.service';
import { filter, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '@app/user/services/user.service';
import { PersonalProjectService } from '../services/personal-project.service';
import { MessagesService } from '@app/services/messages.service';

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

  selectAll$ = new Observable<boolean>();

  actionBar = [
    ProjectAction.Delete,
    ProjectAction.SelectAll
  ];

  statusFilter = [];

  constructor(
    private userService: UserService,
    private messages: MessagesService,
    private personalProjectService: PersonalProjectService,
    private router: Router
  ) {
    this.detailProject$ = personalProjectService.activeProject$;
    personalProjectService.userProfile$.subscribe(
      ([user, role]) => {
        console.log(`role changed to ${role}`);
        this.personalProjectService.reset();
        this.userProfile = user.profiles.find(profile => profile.userProfileType === role);
        this.projects$ = role === 'CLIENT' ? personalProjectService.newProjects$ : personalProjectService.progressProjects$;
        const actions = [
          ProjectAction.Delete,
          ProjectAction.SelectAll
        ];
        this.actionBar = this.userProfile.userProfileType === 'CLIENT' ? [ProjectAction.Create, ...actions] : actions;
        const filters = [
          ProjectState.PROGRESS,
          ProjectState.FINISH,
          ProjectState.CANCEL
        ];
        this.statusFilter = this.userProfile.userProfileType === 'CLIENT' ? [ProjectState.NEW, ...filters] : filters;

      }
    );
  }

  ngOnInit() {
    this.previewProject$ = this.personalProjectService.previewProject$;
    this.personalProjectService.getPersonalProjects(this.userProfile.id);
    this.selectAll$ = this.personalProjectService.selectAll$;
  }

  filterProjectsByState(projects: Project[], state: string | ProjectState, extraState?: string | ProjectState): Project[] {
    return projects.filter(elem => elem.state === state || elem.state === extraState);
  }


  onProjectChecked(event) {
    // Aca deberia setear el multiselected Projects del servicio personal projects, para en caso de acciones multiples
    console.log('checked projects', event);
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

  onActionBarFilters(event) {
    switch (event.status) {
      case ProjectState.NEW:
        this.projects$ = this.personalProjectService.newProjects$;
        break;
      case ProjectState.PROGRESS:
        this.projects$ = this.personalProjectService.progressProjects$;
        break;
      case ProjectState.CANCEL:
        this.projects$ = this.personalProjectService.finishProjects$;
        break;
      case ProjectState.FINISH:
        this.projects$ = this.personalProjectService.cancelProjects$;
        break;

      default:
        break;
    }
    this.personalProjectService.preview(null);
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
      case 'FINISH':
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
    this.personalProjectService.updateExecution(executionId, 'CANCELED').subscribe(
      () => this.messages.showMessages('You have succesfully started a project execution. You can view it in My Projects tab.'),
      err => this.messages.showErrors('There has been an error starting the project execution. Try it later.')
    );

  }


  // hideActionBar(){
  //   this.showActionBar = false;
  // }

  // showActionBarMethod(){
  //   this.showActionBar = true;
  // }
}
