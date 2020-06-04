import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { BehaviorSubject } from 'rxjs';

// localStorage Keys
const PROJECTS = 'PROJECTS';

@Injectable({
  providedIn: 'root'
})
export class ProjectCacheService {


  private subject = new BehaviorSubject<Project[]>([]);

  projects$ = this.subject.asObservable();

  constructor(
  ) {
    this.subject.next(JSON.parse(localStorage.getItem(PROJECTS)) || []);

  }

  getAllProjects(): Project[] {
    const projects = localStorage.getItem(PROJECTS);
    if (projects != null) {
      return JSON.parse(projects);
    }
    return null;
  }

  saveAllProjects(projects: Project[]) {
    localStorage.setItem(PROJECTS, JSON.stringify(projects));
    this.subject.next(projects);
  }

  saveProject(project: Project) {
    const cachedProjects = localStorage.getItem(PROJECTS);
    if (cachedProjects != null) {
      const projects = JSON.parse(cachedProjects);
      this.subject.next([project, ...projects]);
      localStorage.setItem(PROJECTS, JSON.stringify([project, ...projects]));
    } else {
      this.subject.next([project]);
      localStorage.setItem(PROJECTS, JSON.stringify([project]));

    }
  }
}
