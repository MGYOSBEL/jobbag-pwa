import { Component, OnInit } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-briefcase-detail',
  templateUrl: './briefcase-detail.component.html',
  styleUrls: ['./briefcase-detail.component.css'],
  providers: [NgbRatingConfig] //add NgbRatingConfig
})
export class BriefcaseDetailComponent implements OnInit {

  rating: number;

  constructor(config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;

    this.rating = 3;
   }

   ngOnInit() {
  }

}
