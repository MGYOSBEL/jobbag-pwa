import { Project, ProjectDTO, ProjectState } from './project.model';
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
    services: projectDTO.services,
    interestedProfiles: projectDTO.interested_profiles
  };
}

export function projectToDTO(project: Project, userProfileId?: number): ProjectDTO {
  const projectDTO = {
    start_date_expected: project.startDateExpected,
    name: project.name,
    description: project.description,
    state: project.state,
    id_project: project.id || null,
    remote: project.remote,
    divisions: project.divisions,
    services: project.services,
    interested_profiles: project.interestedProfiles
    };
  return !!userProfileId ? {user_profile_id: userProfileId, ...projectDTO} : projectDTO;

}

export function projectStatusToString(status: ProjectState | 'INTEREST'): string {
  switch (status) {
    case ProjectState.CANCEL:
      return 'Canceled';
    case ProjectState.FINISH:
      return 'Finished';
    case ProjectState.NEW:
      return 'New';
    case ProjectState.PROGRESS:
      return 'In Progress';
    case 'INTEREST':
      return 'Interests';
    default:
      break;
  }
}
