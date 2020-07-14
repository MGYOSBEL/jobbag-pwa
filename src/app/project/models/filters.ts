import { Project, ProjectState } from './project.model';
import { DivisionElement } from '@app/user/models/country.model';

export function filterByLocation(projects: Project[], locationFilters: number[]): Project[] {
  const filterProjects = projects.filter(
    project => project.remote || project.divisions.filter(division => locationFilters.includes(division)).length > 0);
  return filterProjects;
}

export function filterByService(projects: Project[], serviceFilters: number[]): Project[] {
  const filterProjects = projects.filter(project => project.services.some(service => serviceFilters.includes(service)));
  return filterProjects;
}

export function filterByStatus(projects: Project[], statusFilter: ProjectState): Project[] {
  return projects.filter(project => project.state === statusFilter);
}


