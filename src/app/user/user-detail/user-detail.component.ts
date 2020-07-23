import { Component, OnInit } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
  providers: [NgbRatingConfig] //add NgbRatingConfig

})
export class UserDetailComponent implements OnInit {

  rating: number;

  constructor(config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;

    this.rating = 3;
   }

  ngOnInit() {
  }

}
