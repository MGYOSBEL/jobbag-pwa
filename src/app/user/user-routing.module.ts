import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardResolverService } from './services/dashboard-resolver.service';
import { AuthGuard } from '@app/auth/helpers/auth.guard';
import { RoleSelectComponent } from '../sharedComponents/role-select/role-select.component';
import { BriefcaseEditComponent } from './briefcase-edit/briefcase-edit.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { NonProfileGuard } from './services/non-profile.guard';
import { EditPasswordComponent } from './edit-password/edit-password.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileResolverService } from './services/profile-resolver.service';


const userRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    // resolve: { user: DashboardResolverService },
    children: [
      {
        path: 'profile',
        children: [
          {
            path: ':id',
            component: ProfileComponent,
            resolve: {profile: ProfileResolverService}
          }
        ]
      },
      {
        path: ':id',
        children: [
          {
            path: 'password',
            component: EditPasswordComponent
          },
          {
            path: ':role',
            children: [
              {
                path: 'create-profile', component: CreateProfileComponent,
              },
              {
                path: 'edit', component: EditProfileComponent
              },
              {
                path: '',
                pathMatch: 'full',
                component: DashboardComponent,
                resolve: {user: DashboardResolverService}
              }]
          },
          {
            path: '', component: RoleSelectComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
