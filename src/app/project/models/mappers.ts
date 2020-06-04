import { Project, ProjectDTO } from './project.model';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';

export function projectFromDTO(projectDTO: ProjectDTO): Project {
  return {
    startDateExpected: projectDTO.start_date_expected,
    ...projectDTO
  };
}

export function projectToDTO(project: Project, userProfileId?: number): ProjectDTO {
  return {
    user_profile_id: userProfileId,
    start_date_expected: project.startDateExpected,
    ...project
  };
}
