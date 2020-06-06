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

  projectsAlreadyLoadedForId: number;  // Id wich projects are loaded for


  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private projectCache: ProjectCacheService
  ) {
    this. projectsAlreadyLoadedForId = 0; // projects not loaded for any profileId
  }

  // Crea un nuevo proyecto.
  // Params: project(proyecto a crear) | userProfileId: id del perfil de usuario asociado
  create(project: Project, userProfileId: number): Observable<Project> {
    const projectToCreate: ProjectDTO = projectToDTO(project, userProfileId);
    console.log('projectToCreate', JSON.stringify(projectToCreate));
    const createProject$ = this.http.post<APIResponse>(`${environment.apiBaseURL}/project`, projectToCreate).pipe(
      map(res => APIResponseToData(res)),
      catchError(err => throwError(err)),
      map(projectDTO => projectFromDTO(projectDTO)),
      tap(receivedProject => {
        const updatedProjects = [receivedProject, ...this.projectsSubject.value];
        this.projectsSubject.next(updatedProjects);
      })
    );

    return this.loading.showLoaderUntilCompletes(createProject$);

  }

  // /api/user_profile/{id_user_profile}/project_summary
  getAllProjectSummariesByProfileId(userProfileId: number): Observable<Project[]> {
    const getProjects$ = this.http.get<APIResponse>(`${environment.apiBaseURL}/user_profile/${userProfileId}/project_summary`)
      .pipe(
        map(APIResponseToData),
        catchError(err => throwError(err)),
        map(arr => arr.map(projectFromDTO)),
        shareReplay(),
        tap((projects) => {
          this.projectsAlreadyLoadedForId = userProfileId;
          this.projectsSubject.next(projects);
        })
      );

    // return this.projectsAlreadyLoadedForId === userProfileId ? this.projects$ : this.loading.showLoaderUntilCompletes(getProjects$);
    return this.loading.showLoaderUntilCompletes(getProjects$);
  }
}
