import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from '@app/components/navbar/navbar.component';
import { ProfileExtrasComponent } from './profile-extras/profile-extras.component';
import { ProfessionsEditComponent } from './professions-edit/professions-edit.component';
import { BirefcaseEditComponent } from './birefcase-edit/birefcase-edit.component';
import { RoleSelectComponent } from './role-select/role-select.component';



@NgModule({
  declarations: [
     DashboardComponent,
     NavbarComponent,
     ProfileExtrasComponent,
     ProfessionsEditComponent,
     BirefcaseEditComponent,
     RoleSelectComponent
    ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
