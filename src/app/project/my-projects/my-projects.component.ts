import { Component, OnInit, Input } from '@angular/core';
import { CandidateProjectService } from '../services/candidate-project.service';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit {

  @Input()
  userProfileId: number;

  candidateProjects: Observable<Project[]>;

  constructor(
    // private candidateProjectService: CandidateProjectService
  ) {
    // this.candidateProjects = this.candidateProjectService.candidateProjects$;
   }

  ngOnInit() {
    // this.candidateProjectService.loadCandidatesByUserProfileId(this.userProfileId);
  }

}
