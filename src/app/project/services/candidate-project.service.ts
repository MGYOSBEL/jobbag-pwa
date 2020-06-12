import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { Project } from '../models/project.model';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateProjectService {

  private candidatesSubject = new BehaviorSubject<Project[]>([]);

  candidateProjects$: Observable<Project[]> = this.candidatesSubject.asObservable();

  multiSelectedProjects: number[];

  activeProjectSubject = new BehaviorSubject<Project>(null);

  activeProject$: Observable<Project> = this.activeProjectSubject.asObservable();

  constructor(private projectService: ProjectService) {
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
