import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './filters/filters.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RoleSelectComponent } from './role-select/role-select.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { HomeComponent } from '@app/home/home.component';
import { NotFoundComponent } from '@app/errors/not-found/not-found.component';
import { InternalServerErrorComponent } from '@app/errors/internal-server-error/internal-server-error.component';
import { SharedComponentsRoutingModule } from './shared-components-routing.module';



@NgModule({
  declarations: [
    FiltersComponent,
    FooterComponent,
    NavbarComponent,
    RoleSelectComponent,
    HomeComponent,
    NotFoundComponent,
    InternalServerErrorComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsRoutingModule
  ],
  exports: [
    FiltersComponent,
    FooterComponent,
    NavbarComponent,
    RoleSelectComponent,
    HomeComponent,
    NotFoundComponent,
    InternalServerErrorComponent
  ]
})
export class SharedComponentsModule { }
