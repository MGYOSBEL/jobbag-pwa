import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { Project, ProjectState } from '../models/project.model';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { filter, tap, catchError, map } from 'rxjs/operators';
import { PersonalProjectService } from './personal-project.service';

@Injectable()
export class CandidateProjectService {

  private candidatesSubject = new BehaviorSubject<Project[]>([]);
  candidateProjects$: Observable<Project[]> = this.candidatesSubject.asObservable();
  // interestProjects$: Observable<Project[]> = this.candidatesSubject.asObservable().pipe(
  //   map(projects => projects.filter(project => ))
  // );
  private interestProjectsSubject = new BehaviorSubject<Project[]>([]);
  interestProjects$ = this.interestProjectsSubject.asObservable();

  private multiSelectedProjectsSubject = new BehaviorSubject<number[]>([]);
  multiSelectedProjects$: Observable<number[]> = this.multiSelectedProjectsSubject.asObservable();


  private activeProjectSubject = new BehaviorSubject<Project>(null);
  activeProject$: Observable<Project> = this.activeProjectSubject.asObservable();

  private selectAllSubject = new BehaviorSubject<boolean>(false);
  selectAll$ = this.selectAllSubject.asObservable();


  constructor(
    private projectService: ProjectService,
    private personalProjectService: PersonalProjectService,
    private authenticationService: AuthenticationService
    ) {
      this.authenticationService.isLoggedIn$.pipe(
        filter(loggedIn => !loggedIn)
      ).subscribe( () => {
        this.resetcandidates();
      });
      this.personalProjectService.newProjects$.subscribe(
        projects => {
          projects = projects.map(elem => {
            return {interest : true, ...elem};
          });
          this.interestProjectsSubject.next(projects);
        }
      );
  }

  selectAll(state: boolean) {
    this.selectAllSubject.next(state);
  }

  setMultiSelected(projects: number[]) {
    this.multiSelectedProjectsSubject.next(projects);
  }
  getMultiSelected(): number[] {
    return this.multiSelectedProjectsSubject.value;
  }

  addInterests(projects: Project[]) {
    const currentInterests = this.interestProjectsSubject.value;
    console.log('currentInterests => ', currentInterests);
    const nextInterests = [...currentInterests, ...projects];
    this.interestProjectsSubject.next(nextInterests);
    console.log('interests after added => ', nextInterests);
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

  registerInterest(userProfileId: number, projects: number []): Observable<boolean> {
    return this.projectService.registerInterestProjects(userProfileId , projects)
    .pipe(
      catchError(err => throwError(err)),
      tap(() => {
        this.uploadCandidates();
        const interests = this.candidatesSubject.value.filter(elem => projects.includes(elem.id));
        console.log('interests ids => ', interests);
        this.addInterests(interests);
        this.preview(null);
      })
    );
  }

  preview(projectId: number) {
    const candidates = this.candidatesSubject.value;
    this.activeProjectSubject.next(candidates.find(proj => proj.id === projectId));
  }

  removeCandidates(projects: number[]) {
    const candidates = this.candidatesSubject.value;
    const newCandidates = candidates.filter(elem => !projects.find(id => id === elem.id));
    return newCandidates;
  }

  uploadCandidates() {
    const candidatesToRemove = this.multiSelectedProjectsSubject.value;
    const newCandidates = this.removeCandidates(candidatesToRemove);
    const addedCandidates = this.candidatesSubject.value.filter(elem => candidatesToRemove.find(id => id === elem.id));
    this.candidatesSubject.next(newCandidates);
    this.projectService.addProjects(addedCandidates);

  }


}
