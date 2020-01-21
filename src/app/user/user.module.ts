import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserService } from './services/user.service';



@NgModule({
  declarations: [
    UserComponent,
     DashboardComponent
    ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
