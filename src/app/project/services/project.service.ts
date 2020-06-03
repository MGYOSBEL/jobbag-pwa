import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { APIResponse } from '@app/models/app.model';
import { Project, ProjectDTO } from '../models/project.model';
import { projectFromDTO, projectToDTO } from '../models/mappers';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projectsSubject: BehaviorSubject<Project[]>;

  private projects$ = this.projectsSubject.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  create(project: Project, userId: number): Observable<Project> {
    const projectToCreate: ProjectDTO = projectToDTO(project, userId);
    return this.http.post<APIResponse>(`${environment.apiBaseURL}/project`, projectToCreate).pipe(
        map(res => JSON.parse(JSON.parse(res.content))),
        map(projectFromDTO)
      );
  }

}
