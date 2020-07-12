import { UserProfile } from '@app/user/models/user.model';

export interface ProjectDTO {
  state: ProjectState;
  name: string;
  id?: number;
  description?: string;
  start_date_expected?: string;
  remote?: boolean;
  divisions?: number[];
  services?: number[];
  user_profile_id?: number;
  interested_profiles?: UserProfile[];
}

export interface ProjectExecutionDTO {
  id: number;
  state: ProjectState;
  creationDate: string;
  lastModificationDate: string;
  userProfileId: number;
  projectId: number;
  project: ProjectDTO;
}



export interface Project {
  state: ProjectState;
  name: string;
  id?: number;
  description?: string;
  startDateExpected?: string;
  remote?: boolean;
  divisions?: number[];
  services?: number[];
  interest?: boolean;
  interestedProfiles?: UserProfile[];
  executionId?: number;
}


export enum ProjectState {
   NEW = 'NEW',
   PROGRESS = 'PROGRESS',
   FINISH = 'FINISH',
   CANCEL = 'CANCEL'
}
export enum ProjectAction {
   SelectAll = 'SELECTALL',
   Apply = 'APPLY',
   Create = 'CREATE',
   Delete = 'DELETE'
}



