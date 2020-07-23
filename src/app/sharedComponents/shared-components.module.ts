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
import { FiabilitySectionComponent } from './fiability-section/fiability-section.component';
import { JoinusSectionComponent } from './joinus-section/joinus-section.component';
import { StatisticsSectionComponent } from './statistics-section/statistics-section.component';
import { HowtodoSectionComponent } from './howtodo-section/howtodo-section.component';
import { ContactSectionComponent } from './contact-section/contact-section.component';
import { RecommendedComponent } from './recommended/recommended.component';
import { LoadingComponent } from './loading/loading.component';
import { LottieAnimationViewModule } from 'ng-lottie';
import { MessagesComponent } from './messages/messages.component';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ImageGalleryComponent } from './image-gallery/image-gallery.component';
import { NgxGalleryModule } from 'ngx-gallery';

@NgModule({
  declarations: [
    FiltersComponent,
    FooterComponent,
    NavbarComponent,
    RoleSelectComponent,
    HomeComponent,
    NotFoundComponent,
    InternalServerErrorComponent,
    FiabilitySectionComponent,
    JoinusSectionComponent,
    StatisticsSectionComponent,
    HowtodoSectionComponent,
    ContactSectionComponent,
    LoadingComponent,
    MultiSelectComponent,
    RecommendedComponent,
    MessagesComponent,
    ImageGalleryComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    SharedComponentsRoutingModule,
    NgxGalleryModule,
    LottieAnimationViewModule.forRoot()
  ],
  exports: [
    FiltersComponent,
    FooterComponent,
    NavbarComponent,
    RoleSelectComponent,
    HomeComponent,
    NotFoundComponent,
    MultiSelectComponent,
    LoadingComponent,
    MessagesComponent,
    InternalServerErrorComponent,
    ImageGalleryComponent
  ]
})
export class SharedComponentsModule { }
