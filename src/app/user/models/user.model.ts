export interface User {
  id: number;
  username: string;
  username_canonical: string;
  email: string;
  email_canonical: string;
  enabled: boolean;
  salt: string;
  password: string;
  groups: string[];
  roles: Role[];
  social_id: string;
  user_profiles: UserProfile[];
}

export interface UserProfile {
id: string;
valoration: string;
phone_number: string;
comment: string;
summary: string;
scholarship: Scholarship;
userProfileType: Role;
briefcases: Briefcase[];
}

export interface Scholarship {
  id: number;
  shortDescription: string;
  descriptionEs: string;
  descriptionEn: string;
  descriptionFr: string;
  }

export interface Profession {
  id: number;
  shortDescription: string;
  descriptionEs: string;
  descriptionEn: string;
  descriptionFr: string;
}


export interface Role {
  id: number;
  type: string;
}

export interface Briefcase {
  id: number;
  description: string;
  startDate: Date;
  endDate: Date;
  comments: string;
  idProfession: number;
}


