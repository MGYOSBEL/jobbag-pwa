import { DivisionElement } from './country.model';

// export interface User {
//   id: number;
//   username: string;
//   username_canonical: string;
//   email: string;
//   email_canonical: string;
//   enabled: boolean;
//   salt: string;
//   password: string;
//   groups: string[];
//   roles: Role[];
//   social_id: string;
//   user_profiles: UserProfile[];
// }
// // Generated by https://quicktype.io

// export interface UserProfile {
//   id: number;
//   valoration: number;
//   phone_number: string;
//   comment: string;
//   summary: string;
//   name: string;
//   id_scholarship_fk: IDFk;
//   id_user_profile_account_fk: IDUserProfileFk;
//   id_user_profile_type_fk: IDUserProfileFk;
//   user_profile_briefcases: UserProfileBriefcase[];
// }

// export interface IDFk {
//   id: number;
//   short_description: string;
//   description_es: string;
//   description_en: string;
// }

// export interface IDUserProfileFk {
//   id: number;
//   type: string;
// }

// export interface UserProfileBriefcase {
//   id: number;
//   comments: string;
//   description: string;
//   startdate: string;
//   enddate: string;
//   id_profession_fk: IDFk;
// }


// // export interface UserProfile {
// // id: string;
// // valoration: string;
// // phone_number: string;
// // comment: string;
// // summary: string;
// // scholarship: Scholarship;
// // userProfileType: Role;
// // briefcases: Briefcase[];
// // }

// export interface Scholarship {
//   id: number;
//   shortDescription: string;
//   descriptionEs: string;
//   descriptionEn: string;
//   descriptionFr: string;
// }

// export interface Profession {
//   id: number;
//   shortDescription: string;
//   descriptionEs: string;
//   descriptionEn: string;
//   descriptionFr: string;
// }


// export interface Role {
//   id: number;
//   type: string;
// }

// export interface Briefcase {
//   id: number;
//   description: string;
//   startDate: Date;
//   endDate: Date;
//   comments: string;
//   idProfession: number;
// }





// Generated by https://quicktype.io

export interface User {
  socialId:              null;
  profiles:          UserProfile[];
  id:                    number;
  username:              string;
  email:                 string;
  provider:              string;
}

export interface UserProfile {
  id:                     number;
  valoration:             number;
  phoneNumber:            string;
  comment:                null;
  summary:                string;
  scholarshipid:          number;
  userId:                 number;
  userProfileType:        string;
  briefcases:  UserProfileBriefcase[];
  picture:                string;
  cv:                     string;
  userProfileAccount:     string;
  name:                   string;
  divisions:              number[];
}

export interface IDScholarshipFk {
  id:                number;
  shortDescription:  string;
  descriptionEs:     string;
  descriptionEn:     string;
  descriptionFr:     null;
  __initializer__:   null;
  __cloner__:        null;
  __isInitialized__: boolean;
}

export interface IDUserProfileFk {
  id:          number;
  type:        string;
  description: null;
}

export interface UserProfileBriefcase {
  id:              number;
  comments:        string;
  description:     string;
  startdate:       string;
  enddate:         string;
  // idProfessionFk:  IDProfessionFk;  Remove profesion
  idUserProfileFk: number;
  pictures:        string[];      //addinng pictures array to the briefcase
}

export interface EnddateClass {
  timezone:  Timezone;
  offset:    number;
  timestamp: number;
}

export interface Timezone {
  name:        string;
  transitions: Transition[];
  location:    Location;
}

export interface Location {
  country_code: string;
  latitude:     number;
  longitude:    number;
  comments:     string;
}

export interface Transition {
  ts:     number;
  time:   string;
  offset: number;
  isdst:  boolean;
  abbr:   Abbr;
}

export enum Abbr {
  Cemt = "CEMT",
  Cest = "CEST",
  Cet = "CET",
  Lmt = "LMT",
}

export interface IDProfessionFk {
  id:               number;
  shortDescription: string;
  descriptionEs:    string;
  descriptionEn:    string;
  descriptionFr:    null;
}








