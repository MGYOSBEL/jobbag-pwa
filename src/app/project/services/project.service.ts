import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { environment } from '@environments/environment';
import { map, tap, catchError, shareReplay } from 'rxjs/operators';
import { APIResponse } from '@app/models/app.model';
import { Project, ProjectDTO } from '../models/project.model';
import { projectFromDTO, projectToDTO } from '../models/mappers';
import { APIResponseToData } from '@app/models/mappers';
import { ProjectCacheService } from './project-cache.service';
import { LoadingService } from '@app/services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projectsSubject = new BehaviorSubject<Project[]>([]);

  projects$ = this.projectsSubject.asObservable();


  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private projectCache: ProjectCacheService
  ) {
  }

  // Crea un nuevo proyecto.
  // Params: project(proyecto a crear) | userProfileId: id del perfil de usuario asociado
  create(project: Project, userProfileId: number): Observable<Project> {
    const projectToCreate: ProjectDTO = projectToDTO(project, userProfileId);
    const createProject$ = this.http.post<APIResponse>(`${environment.apiBaseURL}/project`, projectToCreate).pipe(
      map(APIResponseToData),
      catchError(err => throwError(err)),
      map(projectFromDTO),
      tap(receivedProject => this.projectCache.saveProject(receivedProject))
    );

    return this.loading.showLoaderUntilCompletes(createProject$);

  }

  // /api/user_profile/{id_user_profile}/project_summary
  getAllProjectSummariesByProfileId(userProfileId: number): Observable<Project[]> {
    const cachedProjects = this.projectCache.getAllProjects();
    if (cachedProjects != null) {
      return this.projectCache.projects$;
    }
    const getProjects$ = this.http.get<APIResponse>(`${environment.apiBaseURL}/user_profile/${userProfileId}/project_summary`)
      .pipe(
        map(APIResponseToData),
        catchError(err => throwError(err)),
        map(arr => arr.map(projectFromDTO)),
        shareReplay(),
        tap(projects => this.projectCache.saveAllProjects(projects))
      );

    return this.loading.showLoaderUntilCompletes(getProjects$);
  }
}
