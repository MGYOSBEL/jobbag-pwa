import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from '@app/sharedComponents/navbar/navbar.component';
import { ProfileExtrasComponent } from './profile-extras/profile-extras.component';
import { ProfessionsEditComponent } from './professions-edit/professions-edit.component';
import { BirefcaseEditComponent } from './birefcase-edit/birefcase-edit.component';
import { SharedComponentsModule } from '@app/sharedComponents/shared-components.module';



@NgModule({
  declarations: [
     DashboardComponent,
     ProfileExtrasComponent,
     ProfessionsEditComponent,
     BirefcaseEditComponent
    ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    UserRoutingModule
  ]
})
export class UserModule { }
