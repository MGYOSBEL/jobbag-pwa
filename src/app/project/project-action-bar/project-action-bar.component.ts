import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CandidateProjectService } from '../services/candidate-project.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-project-action-bar',
  templateUrl: './project-action-bar.component.html',
  styleUrls: ['./project-action-bar.component.css']
})
export class ProjectActionBarComponent implements OnInit {

  apply: boolean = true;

  @Output()
  selectAll = new EventEmitter<boolean>();

  @Output()
  action = new EventEmitter<string>();

  constructor(
  ) {
  }

  ngOnInit() {
  }

  onSelectAll(event) {
    this.selectAll.emit(event.target.checked);
  }

  onAction() {
    this.action.emit('apply');
  }





}
