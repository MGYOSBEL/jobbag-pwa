import { Project, ProjectDTO } from './project.model';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';

export function projectFromDTO(projectDTO: ProjectDTO): Project {
  return {
    startDateExpected: projectDTO.start_date_expected,
    name: projectDTO.name,
    description: projectDTO.description,
    state: projectDTO.state,
    id: projectDTO.id,
    remote: projectDTO.remote,
    divisions: projectDTO.divisions,
    services: projectDTO.services
  };
}

export function projectToDTO(project: Project, userProfileId?: number): ProjectDTO {
  return {
    user_profile_id: !!userProfileId ? userProfileId : null,
    start_date_expected: project.startDateExpected,
    name: project.name,
    description: project.description,
    state: project.state,
    id: project.id || null,
    remote: project.remote,
    divisions: project.divisions,
    services: project.services
    };
}
