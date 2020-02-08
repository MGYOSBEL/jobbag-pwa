import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../error.service';

@Component({
  selector: 'app-internal-server-error',
  templateUrl: './internal-server-error.component.html',
  styleUrls: ['./internal-server-error.component.css']
})
export class InternalServerErrorComponent implements OnInit {

  errorMessage: any;

  constructor(private errorService: ErrorService) { }

  ngOnInit() {
    this.errorMessage = this.errorService.errorMessage;
  }

}
