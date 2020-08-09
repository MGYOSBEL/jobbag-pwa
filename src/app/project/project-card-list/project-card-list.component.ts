import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Project } from '../models/project.model';
import { CandidateProjectService } from '../services/candidate-project.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-project-card-list',
  templateUrl: './project-card-list.component.html',
  styleUrls: ['./project-card-list.component.css']
})
export class ProjectCardListComponent implements OnInit {

  @Input()
  projects: Project[];

  @Input()
  masterSelected$: Observable<boolean>;

  @Input()
  reset$: Observable<number>;

  private selectedProjects: number[];

  @Input()
  cardMode: 'WIDE' | 'COMPACT';

  @Output()
  checkedProjects = new EventEmitter<number[]>();

  @Output()
  cardClicked = new EventEmitter<number>();
  @Output()
  projectDetail = new EventEmitter<number>();

  private pressedCardSubject = new BehaviorSubject<number>(null);
  pressedCard$ = this.pressedCardSubject.asObservable();


  constructor() {}

  ngOnInit() {
    this.reset$.subscribe(
        (state) => {
          if (!state) {
            this.reset();
          }
        }
      );
    this.masterSelected$
      .subscribe(state => {
        this.selectedProjects = state ? this.projects.map(elem => elem.id) : [];
        this.checkedProjects.emit(this.selectedProjects);
      });
  }

  onCardCheck(event) {
    let checked = new Set(this.selectedProjects);
    if (event.state) {
      checked.add(event.projectId);
    } else {
      checked.delete(event.projectId);
    }
    this.selectedProjects = Array.from(checked);
    this.checkedProjects.emit(this.selectedProjects);
  }

  onCardClicked(event) {
    this.cardClicked.emit(event);
    this.pressedCardSubject.next(event);
  }

  onCardDetail(event) {
    this.projectDetail.emit(event);
  }

  reset() {
    this.pressedCardSubject.next(null);
  }
}
