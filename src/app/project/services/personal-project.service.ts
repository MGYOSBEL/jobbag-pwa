import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Project, ProjectState } from '../models/project.model';
import { map, tap } from 'rxjs/operators';
import { UserProfile } from '@app/user/models/user.model';
import { UserService } from '@app/user/services/user.service';
import { LoadingService } from '@app/services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class PersonalProjectService {

  constructor(
    private projectService: ProjectService,
    private loading: LoadingService,
    private userService: UserService) {
    this.userProfile$ = combineLatest(
      userService.loggedUser$,
      userService.role$
    ).pipe(
      tap(([user, role]) => {
        const profile: UserProfile = user.profiles.find(elem => elem.userProfileType === role);
        this.getPersonalProjects(profile.id);
        console.log('profile has changed =>', role, profile, profile.id);
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

  getPersonalProjects(userProfileId: number) {
    const projects$ = this.projectService.getAllProjectSummariesByProfileId(userProfileId);
    this.loading.showLoaderUntilCompletes(projects$).subscribe(
      projects => this.personalProjectsSubject.next(projects)
    );
  }

  addPersonalProject(project: Project) {
    const projects = this.personalProjectsSubject.value;
    projects.push(project);
    this.personalProjectsSubject.next(projects);
  }

  viewDetail(userProfileId: number, projectId: number) {
    this.projectService.getProjectDetailByProfileType(userProfileId, projectId).subscribe(
      project => this.activeProjectSubject.next(project)
    );
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
}
