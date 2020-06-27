import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Project, ProjectState } from '../models/project.model';
import { map } from 'rxjs/operators';
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
    );
  }

  userProfile$: Observable<any>;

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

  viewDetail(projectId: number) {
    const project = this.personalProjectsSubject.value.find(proj => proj.id === projectId);
    if (project != null) {
      this.activeProjectSubject.next(project);
    }
  }

  backToList() {
    this.activeProjectSubject.next(null);
  }


  preview(projectId: number) {
    const projects = this.personalProjectsSubject.value;
    this.previewProjectSubject.next(projects.find(proj => proj.id === projectId));
  }
}
