import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DashBoardResolver implements Resolve<User> {

  constructor(private userService: UserService) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<User> | Promise<User> | User {

    return ;
  }
}
