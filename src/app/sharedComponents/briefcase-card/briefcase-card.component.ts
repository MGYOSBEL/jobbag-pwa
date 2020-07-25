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
  };

  @Output()
  viewDetail = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  onBriefcaseDetail() {
    this.viewDetail.emit(this.params.id);
  }

}
