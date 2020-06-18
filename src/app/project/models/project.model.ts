
export interface ProjectDTO {
  state:             ProjectState;
  name:              string;
  id?:                number;
  description?:       string;
  start_date_expected?: string;
  remote?:            boolean;
  divisions?:         number[];
  services?:          number[];
  user_profile_id?:     number;
}



export interface Project {
  state:             ProjectState;
  name:              string;
  id?:                number;
  description?:       string;
  startDateExpected?: string;
  remote?:            boolean;
  divisions?:         number[];
  services?:          number[];
}


export enum ProjectState {
   NEW = 'NEW',
   PROGRESS = 'PROGRESS',
   FINISH = 'FINISH',
   CANCEL = 'CANCEL'
}



