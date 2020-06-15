import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../models/project.model';
import { CandidateProjectService } from '../services/candidate-project.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {

  @Input()
  project: Project;

  constructor(private candidateProjectService: CandidateProjectService) { }

  ngOnInit() {
  }

  onClick() {
    this.candidateProjectService.preview(this.project.id);
  }

  getColor(){
    if(this.project.name === 'Write')
    {
      return 'solid 8px #7bcff4';
    }
    else if(this.project.name === 'Read'){
      return 'solid 8px #a1d173';
    }
    else{
      return 'solid 8px #f99d6e';
    }
  }

}
