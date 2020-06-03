
export interface ProjectDTO {
  state:             string;
  name:              string;
  id?:                number;
  description?:       string;
  startDateExpected?: string;
  remote?:            boolean;
  divisions?:         number[];
  services?:          number[];
  user_profile_id?:     number;
}



export interface Project {
  state:             string;
  name:              string;
  id?:                number;
  description?:       string;
  startDateExpected?: string;
  remote?:            boolean;
  divisions?:         number[];
  services?:          number[];
}



