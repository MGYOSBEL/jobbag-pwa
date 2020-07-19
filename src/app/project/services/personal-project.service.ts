import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { BehaviorSubject, Observable, combineLatest, throwError } from 'rxjs';
import { Project, ProjectState } from '../models/project.model';
import { map, tap, catchError } from 'rxjs/operators';
import { UserProfile } from '@app/user/models/user.model';
import { UserService } from '@app/user/services/user.service';
import { LoadingService } from '@app/services/loading.service';
import { MessagesService } from '@app/services/messages.service';

@Injectable({
  providedIn: 'root'
})
export class PersonalProjectService {

  constructor(
    private projectService: ProjectService,
    private loading: LoadingService,
    private messages: MessagesService,
    private userService: UserService) {
    this.userProfile$ = combineLatest(
      userService.loggedUser$,
      userService.role$
    ).pipe(
      tap(([user, role]) => {
        if (!!user) {
          const profile: UserProfile = user.profiles.find(elem => elem.userProfileType === role);
          role === 'CLIENT' ? this.getPersonalProjects(profile.id) : this.getPersonalProjectExecutions(profile.id);
        }
      }
      )
    );
  }

  userProfile$: Observable<any>;

  // Subject y observable para el Select All
  private selectAllSubject = new BehaviorSubject<boolean>(false);
  selectAll$: Observable<boolean> = this.selectAllSubject.asObservable();

  // Subject y Observable para el project-detail
  activeProjectSubject = new BehaviorSubject<Project>(null);
  activeProject$: Observable<Project> = this.activeProjectSubject.asObservable();

  // Subject y Observable para mostrar el preview
  previewProjectSubject = new BehaviorSubject<Project>(null);
  previewProject$: Observable<Project> = this.previewProjectSubject.asObservable();

  // Subject y Observables con los projectos del usuario. Observables filtrados por status
  personalProjectsSubject = new BehaviorSubject<Project[]>([]);
  personalProjects$: Observable<Project[]> = this.personalProjectsSubject.asObservable();
  newProjects$ = this.personalProjectsSubject.asObservable().pipe(
    map(projects => projects.filter(project => project.state === ProjectState.NEW))
  );
  progressProjects$ = this.personalProjectsSubject.asObservable().pipe(
    map(projects => projects.filter(project => project.state === ProjectState.PROGRESS))
  );
  finishProjects$ = this.personalProjectsSubject.asObservable().pipe(
    map(projects => projects.filter(project => project.state === ProjectState.FINISH))
  );
  cancelProjects$ = this.personalProjectsSubject.asObservable().pipe(
    map(projects => projects.filter(project => project.state === ProjectState.CANCEL))
  );

  getPersonalProjectExecutions(userProfileId: number) {
    const projects$ = this.projectService.getAllProjectSummariesByProfileId(userProfileId);
    const executions$ = this.projectService.getAllProjectExecutionsByProfileId(userProfileId);
    const combinedProjects$ = combineLatest(projects$, executions$);
    this.loading.showLoaderUntilCompletes(combinedProjects$).subscribe(
      ([projects, executions]) => {
        const combinedProjects = [...projects, ...executions];
        this.personalProjectsSubject.next(combinedProjects);
      },
      err => this.messages.showErrors('Error fetching some data. Refresh the page or try again later.')
    );
  }

  getPersonalProjects(userProfileId: number) {
    const projects$ = this.projectService.getAllProjectSummariesByProfileId(userProfileId);
    this.loading.showLoaderUntilCompletes(projects$).subscribe(
      projects => this.personalProjectsSubject.next(projects),
      err => this.messages.showErrors('Error fetching some data. Refresh the page or try again later.')
    );

  }

  addPersonalProject(project: Project) {
    const projects = this.personalProjectsSubject.value;
    const index = projects.findIndex(elem => elem.id === project.id);
    if (index !== -1) {
      projects[index] = project;
    } else {
      projects.push(project);
    }
    this.personalProjectsSubject.next(projects);

  }

  viewDetail(userProfileId: number, projectId: number) {
    const project = this.personalProjectsSubject.value.find(proj => proj.id === projectId);
    this.projectService.getProjectDetailByProfileType(userProfileId, projectId).subscribe(
      responseProject => {
        responseProject.state = project.state;
        responseProject.executionId = project.executionId;
        this.activeProjectSubject.next(responseProject);
       }
    );
  }

  getProjectById(projectId: number) {
    const projects = this.personalProjectsSubject.value;
    const project = projects.find(proj => proj.id === projectId);
    return project;
  }

  backToList() {
    this.activeProjectSubject.next(null);
    this.previewProjectSubject.next(null);
  }

  selectAll(state: boolean) {
    this.selectAllSubject.next(state);
  }

  reset() {
    this.preview(null);
    this.activeProjectSubject.next(null);
  }


  preview(projectId: number) {
    const projects = this.personalProjectsSubject.value;
    this.previewProjectSubject.next(projects.find(proj => proj.id === projectId));
  }

  updateExecution(executionId: number, state: 'FINISH' | 'CANCEL') {
    return this.projectService.updateProjectExecution(executionId, state).pipe(
      catchError(err => throwError(err)),
      tap(project => {
        this.preview(null);
        const projects = this.personalProjectsSubject.value;
        const index = projects.findIndex(elem => elem.id === project.id);
        projects[index] = project;
        this.personalProjectsSubject.next(projects);
      })
    );
  }
}
