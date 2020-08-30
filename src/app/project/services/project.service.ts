import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { environment } from '@environments/environment';
import { map, tap, catchError, shareReplay } from 'rxjs/operators';
import { APIResponse } from '@app/models/app.model';
import { Project, ProjectDTO, ProjectState } from '../models/project.model';
import { projectFromDTO, projectToDTO, projectFromExecution, projectFromCandidateDTO } from '../models/mappers';
import { APIResponseToData } from '@app/models/mappers';
import { ProjectCacheService } from './project-cache.service';
import { LoadingService } from '@app/services/loading.service';
import { Service } from '@app/user/models/services.model';

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
    this.projectsAlreadyLoadedForId = 0; // projects not loaded for any profileId
  }

  // Crea un nuevo proyecto.
  // Params: project(proyecto a crear) | userProfileId: id del perfil de usuario asociado
  create(project: Project, userProfileId: number): Observable<Project> {
    const projectToCreate: ProjectDTO = projectToDTO(project, userProfileId);
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
        map(projects => projects.map(projectFromDTO)),
        shareReplay(),
        tap((projects) => {
          this.projectsAlreadyLoadedForId = userProfileId;
          this.projectsSubject.next(projects);
        })
      );

    // return this.projectsAlreadyLoadedForId === userProfileId ? this.projects$ : this.loading.showLoaderUntilCompletes(getProjects$);
    return this.loading.showLoaderUntilCompletes(getProjects$);
  }

  // /api/user_profile/{id_user_profile}/project_execution
  getAllProjectExecutionsByProfileId(userProfileId: number): Observable<Project[]> {
    const getProjects$ = this.http.get<APIResponse>(`${environment.apiBaseURL}/user_profile/${userProfileId}/project_execution`)
      .pipe(
        map(APIResponseToData),
        catchError(err => throwError(err)),
        map(projects => projects.map(proj => projectFromExecution(proj))),
        shareReplay(),
        tap((projects) => {
          this.projectsAlreadyLoadedForId = userProfileId;
          this.projectsSubject.next(projects);
        })
      );
    return this.loading.showLoaderUntilCompletes(getProjects$);
  }

  // Obtener proyectos candidatos
  getCandidateProjects(userProfileId: number, filters?: { services: number[], divisions: number[] }): Observable<Project[]> {
    const request = {
      user_profile_id: userProfileId,
      ...filters
    };
    return this.http.post(`${environment.apiBaseURL}/project_candidate`, request).pipe(
      map(APIResponseToData),
      catchError(err => throwError(err)),
      map(arr => arr.map(projectFromCandidateDTO)),
      shareReplay(),
      tap()
    );
  }

  // Params:
  // userProfileId: Id del proveedor de servicios
  // projects: Ids de los proyectos q se van a agregar como interes
  registerInterestProjects(userProfileId: number, projects: number[]): Observable<boolean> {
    const request = {
      user_profile_id: userProfileId,
      projects
    };
    const registerInterestProject$ = this.http.post<APIResponse>(`${environment.apiBaseURL}/project_interest`, request)
      .pipe(
        map(APIResponseToData),
        catchError(err => throwError(err)),
        map(res => 'OK' ? true : false),
        shareReplay()
      );

    return this.loading.showLoaderUntilCompletes(registerInterestProject$);
  }

  // http://jobbag.api/api/user_profile/6/project/6
  getProjectDetailByProfileType(userProfileId: number, projectId): Observable<Project> {
    const projectDetail$ = this.http.get<APIResponse>(`${environment.apiBaseURL}/user_profile/${userProfileId}/project/${projectId}`)
      .pipe(
        map(APIResponseToData),
        catchError(err => throwError(err)),
        map(projectFromDTO),
        shareReplay()
      );
    return this.loading.showLoaderUntilCompletes(projectDetail$);
  }

  edit(project: Project): Observable<Project> {
    const request = projectToDTO(project);
    const editProject$ = this.http.put<APIResponse>(`${environment.apiBaseURL}/project`, request).pipe(
      map(APIResponseToData),
      catchError(err => throwError(err)),
      map(projectFromDTO),
      shareReplay(),
      tap()
    );

    return this.loading.showLoaderUntilCompletes(editProject$);
  }

  addProjects(projects: Project[]) {
    const oldProjects = this.projectsSubject.value;
    const newProjects = oldProjects.concat(projects);
    this.projectsSubject.next(newProjects);
  }

  registerProjectExecution(projectId: number, userProfileId: number): Observable<Project> {
    const request = {
      id_user_profile: userProfileId,
      id_project: projectId
    };
    const execution$ = this.http.post(`${environment.apiBaseURL}/project_execution`, request).pipe(
      map(APIResponseToData),
      catchError(err => throwError(err)),
      map(execution => projectFromExecution(execution)),
      shareReplay(),
      tap((project) => {
      })
    );
    return this.loading.showLoaderUntilCompletes(execution$);
  }

  updateProjectExecution(id: number, state: 'FINISH' | 'CANCEL', id_associate_user_profile_briefcase?: number): Observable<Project> {
    const request = { id, state, id_associate_user_profile_briefcase };
    const execution$ = this.http.put(`${environment.apiBaseURL}/project_execution`, request).pipe(
      map(APIResponseToData),
      catchError(err => throwError(err)),
      map(execution => projectFromExecution(execution)),
      shareReplay(),
      tap((project) => {
      })
    );
    return this.loading.showLoaderUntilCompletes(execution$);
  }

  updateProjectState(id: number, state: 'FINISH' | 'CANCEL'): Observable<Project> {
    const request = { id_project: id, state};
    const execution$ = this.http.put(`${environment.apiBaseURL}/project/state`, request).pipe(
      map(APIResponseToData),
      catchError(err => throwError(err)),
      map(execution => projectFromDTO(execution)),
      shareReplay(),
      tap((project) => {
      })
    );
    return this.loading.showLoaderUntilCompletes(execution$);

  }

}
