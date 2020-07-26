import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileBriefcase } from '../models/user.model';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-briefcase-detail',
  templateUrl: './briefcase-detail.component.html',
  styleUrls: ['./briefcase-detail.component.css'],
  providers: [NgbRatingConfig] //add NgbRatingConfig
})
export class BriefcaseDetailComponent implements OnInit {

  apiPublic: string;
  rating: number;
  @Input()
  briefcase: UserProfileBriefcase;
  @Input()
  userName: string;
  @Output()
  closeDetail = new EventEmitter<boolean>();

  constructor(config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;

    this.rating = 3;
   }

   ngOnInit() {
    this.apiPublic = `${environment.serverBaseURL}/`;
  }

  closeBriefcaseDetail() {
    this.closeDetail.emit(true);
  }


}
