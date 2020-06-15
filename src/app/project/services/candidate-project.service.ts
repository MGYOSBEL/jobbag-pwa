import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { Project } from '../models/project.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CandidateProjectService {

  private candidatesSubject = new BehaviorSubject<Project[]>([]);

  candidateProjects$: Observable<Project[]> = this.candidatesSubject.asObservable();

  multiSelectedProjects: number[];

  activeProjectSubject = new BehaviorSubject<Project>(null);

  activeProject$: Observable<Project> = this.activeProjectSubject.asObservable();

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

  resetcandidates() {
    this.candidatesSubject.next([]);
    this.activeProjectSubject.next(null);
    this.multiSelectedProjects = [];
  }

  loadCandidatesByUserProfileId(userProfileId: number) {
   this.projectService.getCandidateProjects(userProfileId).subscribe(
     projects => this.candidatesSubject.next(projects)
   );
  }

  preview(projectId: number) {
    const candidates = this.candidatesSubject.value;
    this.activeProjectSubject.next(candidates.find(proj => proj.id === projectId));
  }
}
