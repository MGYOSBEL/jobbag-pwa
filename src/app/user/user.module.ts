import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from '@app/sharedComponents/navbar/navbar.component';
import { BriefcaseEditComponent } from './briefcase-edit/briefcase-edit.component';
import { SharedComponentsModule } from '@app/sharedComponents/shared-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { EditPasswordComponent } from './edit-password/edit-password.component';
import { ProjectModule } from '@app/project/project.module';
import { UserDetailComponent } from './user-detail/user-detail.component';

@NgModule({
  declarations: [
    DashboardComponent,
    BriefcaseEditComponent,
    CreateProfileComponent,
    EditProfileComponent,
    EditPasswordComponent,
    UserDetailComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    UserRoutingModule,
    ProjectModule

  ]
})
export class UserModule { }
