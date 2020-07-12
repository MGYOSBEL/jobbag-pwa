import { Project } from './project.model';
import { DivisionElement } from '@app/user/models/country.model';

export function filterByLocation(projects: Project[], locationFilters: number[]): Project[] {
  const filterProjects = projects.filter(project => project.divisions.some(division => locationFilters.includes(division)));
  console.log('filtered by Location => ', filterProjects);
  return filterProjects;
}

export function filterByService(projects: Project[], serviceFilters: number[]): Project[] {
  const filterProjects = projects.filter(project => project.services.some(service => serviceFilters.includes(service)));
  console.log('filtered by Location => ', filterProjects);
  return filterProjects;
}
