import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { Project } from '../models/project.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { filter, tap } from 'rxjs/operators';

@Injectable()
export class CandidateProjectService {

  private candidatesSubject = new BehaviorSubject<Project[]>([]);
  candidateProjects$: Observable<Project[]> = this.candidatesSubject.asObservable();


  private multiSelectedProjectsSubject = new BehaviorSubject<number[]>([]);
  multiSelectedProjects$: Observable<number[]> = this.multiSelectedProjectsSubject.asObservable();


  private activeProjectSubject = new BehaviorSubject<Project>(null);
  activeProject$: Observable<Project> = this.activeProjectSubject.asObservable();

  private selectAllSubject = new BehaviorSubject<boolean>(false);
  selectAll$ = this.selectAllSubject.asObservable();


  constructor(
    private projectService: ProjectService,
    private authenticationService: AuthenticationService
    ) {
      this.authenticationService.isLoggedIn$.pipe(
        filter(loggedIn => !loggedIn)
      ).subscribe( () => {
        this.resetcandidates();
      });
  }

  selectAll(state: boolean) {
    this.selectAllSubject.next(state);
  }

  setMultiSelected(projects: number[]) {
    this.multiSelectedProjectsSubject.next(projects);
  }

  resetcandidates() {
    this.candidatesSubject.next([]);
    this.activeProjectSubject.next(null);
    this.selectAllSubject.next(false);
    this.multiSelectedProjectsSubject.next([]);
  }

  loadCandidatesByUserProfileId(userProfileId: number) {
   this.projectService.getCandidateProjects(userProfileId).subscribe(
     projects => this.candidatesSubject.next(projects)
   );
  }

  registerInterest(userProfileId: number): Observable<boolean> {
    return this.projectService.registerInterestProjects(userProfileId , this.multiSelectedProjectsSubject.value);
  }

  preview(projectId: number) {
    const candidates = this.candidatesSubject.value;
    this.activeProjectSubject.next(candidates.find(proj => proj.id === projectId));
  }


}
