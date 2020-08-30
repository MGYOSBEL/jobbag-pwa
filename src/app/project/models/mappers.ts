import { Project, ProjectDTO, ProjectState, ProjectExecutionDTO, CandidateDTO } from './project.model';
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
    interestedProfiles: projectDTO.interested_profiles,
    userProfileOwnerId: projectDTO.user_profile_owner_id,
    creationDate: projectDTO.creation_date
  };
}
export function projectFromCandidateDTO(projectDTO: CandidateDTO): Project {
  return {
    startDateExpected: projectDTO.startDateExpected,
    name: projectDTO.name,
    description: projectDTO.description,
    state: projectDTO.state,
    id: projectDTO.id,
    remote: projectDTO.remote,
    divisions: projectDTO.divisions,
    services: projectDTO.services,
    interestedProfiles: projectDTO.interestedProfiles,
    userProfileOwnerId: projectDTO.userProfileOwnerId,
    creationDate: projectDTO.creationDate
  };
}

export function projectFromExecution(executionDTO: ProjectExecutionDTO): Project {
  const project = projectFromDTO(executionDTO.project);
  project.state = executionDTO.state;
  project.executionId = executionDTO.id;
  project.creationDate = executionDTO.creation_date;
  project.projectBriefcaseId = executionDTO.id_associate_user_profile_briefcase;
  return project;
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
    // interested_profiles: project.interestedProfiles
    };
  return !!userProfileId ? {user_profile_id: userProfileId, ...projectDTO} : projectDTO;

}

export function projectStatusToString(status: ProjectState | 'INTEREST' | 'MIXED'): string {
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
    case 'MIXED':
      return 'Mixed view';
    default:
      break;
  }
}
