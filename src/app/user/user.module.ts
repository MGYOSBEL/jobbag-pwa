import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from '@app/components/navbar/navbar.component';



@NgModule({
  declarations: [
     DashboardComponent,
     NavbarComponent
    ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
