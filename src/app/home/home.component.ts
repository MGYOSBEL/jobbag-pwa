import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/user/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }
  userId: string;

  ngOnInit() {
    // this.userId = JSON.parse(JSON.parse(localStorage.getItem('bearerToken')).content).user_id;
  }



}
