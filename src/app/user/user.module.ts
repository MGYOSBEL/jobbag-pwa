import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from '@app/sharedComponents/navbar/navbar.component';
import { ProfileExtrasComponent } from './profile-extras/profile-extras.component';
import { ProfessionsEditComponent } from './professions-edit/professions-edit.component';
import { BriefcaseEditComponent } from './briefcase-edit/briefcase-edit.component';
import { SharedComponentsModule } from '@app/sharedComponents/shared-components.module';
import { ProjectsComponent } from './projects/projects.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateProfileComponent } from './create-profile/create-profile.component';



@NgModule({
  declarations: [
     DashboardComponent,
     ProfileExtrasComponent,
     ProfessionsEditComponent,
     BriefcaseEditComponent,
     ProjectsComponent,
     CreateProfileComponent
    ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    UserRoutingModule
  ]
})
export class UserModule { }
