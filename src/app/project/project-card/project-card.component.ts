import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Project, ProjectState } from '../models/project.model';
import { CandidateProjectService } from '../services/candidate-project.service';
import { timeInterval } from 'rxjs/operators';
import { interval, Observable } from 'rxjs';
import { UserService } from '@app/user/services/user.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'; // toEdit

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {

  @Input()
  project: Project;

  @Input()
  pressed$: Observable<number>;

  @Output() checked = new EventEmitter<{ state: boolean, projectId: number }>();

  @Output() clicked = new EventEmitter<number>();

  @Input()
  cardSelected: boolean;

  @Input()
  cardMode: 'WIDE' | 'COMPACT';

  isPressed: boolean;

  private userRole: string;

  constructor(
    private route: ActivatedRoute, // toEdit
    private router: Router, // toEdit)
    private userService: UserService
    ) {}




  ngOnInit() {
    this.userRole = this.userService.role;
    console.log(this.userService.role);

    this.pressed$.subscribe(
      id => this.isPressed = (this.project.id === id)
    );
  }

  onClick() {
    this.clicked.emit(this.project.id);
  }

  onCheck(event) {
    this.checked.emit({
      state: event.target.checked,
      projectId: this.project.id
    });
    if (this.cardMode === 'WIDE') {
      this.clicked.emit(this.project.id);
    }
  }

  // getColor() {
  //   if (this.project.interest) {
  //     return 'solid 8px #2788c7';
  //   }
  //   switch (this.project.state) {
  //     case ProjectState.NEW:
  //       return 'solid 8px #7bcff4';
  //     case ProjectState.PROGRESS:
  //       return 'solid 8px #a1d173';
  //     case ProjectState.FINISH:
  //       return 'solid 8px #f99d6e';
  //     case ProjectState.CANCEL:
  //       return 'solid 8px #f15d5d';

  //     default:
  //       break;
  //   }
  // }

  getColor() {
    return this.isPressed === true?'solid 8px #2788c7':'';
  }

  checkCard(state: boolean) {
    this.cardSelected = state;
    this.checked.emit({
      state,
      projectId: this.project.id
    });
  }

  onEditProject() {
    this.router.navigateByUrl(`/project/${this.project.id}/edit`);
  }


}
