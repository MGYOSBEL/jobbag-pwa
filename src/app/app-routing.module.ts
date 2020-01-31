import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/helpers/auth.guard';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { InternalServerErrorComponent } from './errors/internal-server-error/internal-server-error.component';
import {UserModule} from './user/user.module';



const routes: Routes = [
  {
    path: 'login', loadChildren: () => import('./auth/auth.module').then(mod => mod.AuthModule)
  },
  {
    path: 'user', loadChildren: () => import('./user/user.module').then(mod => mod.UserModule),
    canLoad: [AuthGuard]
  },
  { path: 'home', component: HomeComponent },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'error', component: InternalServerErrorComponent
  },
  {
    path: '**', component: NotFoundComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
