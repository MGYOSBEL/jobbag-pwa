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

  personalProjectsSubject = new BehaviorSubject<Project[]>([]);

  personalProjects$: Observable<Project[]> = this.personalProjectsSubject.asObservable();

  newProjects$ = this.personalProjectsSubject.asObservable().pipe(
    map(projects => projects.filter(project => project.state === ProjectState.NEW))
  );
  progressProjects$ = this.personalProjectsSubject.asObservable().pipe(
    map(projects => projects.filter(project => project.state === ProjectState.PROGRESS))
  );
  finishProjects$ = this.personalProjectsSubject.asObservable().pipe(
    map(projects => projects.filter(project => project.state === ProjectState.FINISH || project.state === ProjectState.CANCEL))
  );

  getPersonalProjects(userProfileId: number) {
    const projects$ = this.projectService.getAllProjectSummariesByProfileId(userProfileId);
    this.loading.showLoaderUntilCompletes(projects$).subscribe(
      projects => this.personalProjectsSubject.next(projects)
    );
  }
}
