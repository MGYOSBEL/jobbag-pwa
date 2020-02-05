import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {Projects} from './mock-projects';
import {project} from './project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  
  constructor() {
    
   }

   getProjects(){
     return Projects;
   }
}
