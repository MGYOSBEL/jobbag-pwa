import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-briefcase-card',
  templateUrl: './briefcase-card.component.html',
  styleUrls: ['./briefcase-card.component.css']
})
export class BriefcaseCardComponent implements OnInit {

  @Input()
  params: {
    id: number;
    verified: boolean;
    picture: string;
    description: string;
  };

  @Input() editable = false;
  @Output()
  action = new EventEmitter<{action: 'edit' | 'delete' | 'detail', id: number}>();
  actionIconMouseOver: boolean;
  constructor() { }

  ngOnInit() {
    this.actionIconMouseOver = false;
  }

  onBriefcaseDetail() {
    this.action.emit({action: 'detail', id: this.params.id});
  }
  onBriefcaseEdit() {
    this.action.emit({action: 'edit', id: this.params.id});
  }
  onBriefcaseDelete() {
    this.action.emit({action: 'delete', id: this.params.id});
  }
  onCardHover(event) {
  }
}
