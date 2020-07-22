import { Project, ProjectState } from './project.model';
import { DivisionElement } from '@app/user/models/country.model';
import { dateFromModel, dateToModel } from '@app/models/date.format';
import { formatDate } from '@angular/common';

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

export function filterByCreationDate(projects: Project[], limitDate: string): Project[] {
  const filterProjects = projects.filter(project =>
    isAfter(project.creationDate || formatDate(Date.now(), 'yyyy-MM-dd', 'en-US'), limitDate));
  return filterProjects;
}

export function substractMonths(currentDate: string, months: number): string {
  const date = dateFromModel(currentDate);
  const difference = (date.month - months);
  const limitDate = difference > 0
  ? {year: date.year, month: difference, day: date.day}
  : {year: date.year - 1, month: 12 + difference, day: date.day};
  return dateToModel(limitDate);
}

function isAfter(currentDate: string, limitDate: string): boolean {
  const current = dateFromModel(currentDate);
  const limit = dateFromModel(limitDate);
  if (current.year - limit.year !== 0) {
    return current.year > limit.year;
  } else if (current.month - limit.month !== 0) {
    return current.month > limit.month;
  } else if (current.day - limit.day !== 0) {
    return current.day > limit.day;
  }
  return true;
}
