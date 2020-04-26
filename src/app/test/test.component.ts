import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin, EMPTY, combineLatest, of, concat, Subject } from 'rxjs';
import { CountryService } from '@app/user/services/country.service';
import { Country } from '@app/user/models/country.model';
import { ServicesService } from '@app/user/services/services.service';
import { Service } from '@app/user/models/services.model';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  services$: Observable<Service[]>;
  searchInput$ = new Subject<string>();
  selectedServices: number[];

  // services: Service[];

  services: Service[] = [
    {
      id: 1,
      shortDescription: 'Consulta de información legal y consejo',
      descriptionEs: 'Consulta de información legal y consejo',
      descriptionEn: 'Consultation for legal information and advice',
      descriptionFr: null,
      keywords: ['Servicios Legales', 'Leyes y Seguridad Pública', 'inf']
    },
    {
      id: 2,
      shortDescription: 'Preparacion de documentos',
      descriptionEs: 'Preparacion de documentos',
      descriptionEn: 'Preparation of documents',
      descriptionFr: null,
      keywords: ['Servicios Legales', 'Leyes y Seguridad Pública']
    },
    {
      id: 3,
      shortDescription: 'Representacion de clientes en negociaciones',
      descriptionEs: 'Representacion de clientes en negociaciones',
      descriptionEn: 'Representing clients in negotiations',
      descriptionFr: null,
      keywords: ['Servicios Legales', 'Leyes y Seguridad Pública']
    },
    {
      id: 4,
      shortDescription: 'Consultor de recursos Humanos',
      descriptionEs: 'Consultor de recursos Humanos',
      descriptionEn: 'Human Resource Consultant',
      descriptionFr: null,
      keywords: ['Agente', 'Administracion y Negocios']
    },
    {
      id: 5,
      shortDescription: 'Profesor de animacion',
      descriptionEs: 'Profesor de animacion',
      descriptionEn: 'Teaching on Animation',
      descriptionFr: null,
      keywords: ['Arte y multimedia', 'Servicios de animacion', 'Arte, Diseño y Entretenimiento', 'Educación']
    }
  ];

  // selectedServices: Service[];


  countries$: Observable<Country>;
  constructor(
    private countryService: CountryService,
    private servicesServ: ServicesService
  ) {}


  ngOnInit() {
    this.countries$ = this.countryService.get();
    this.loadServices();
    // this.servicesServ.getAll().subscribe(
    //   services => this.services = services
    // );
  }

customSearchFn(term: string, item: Service) {
  term = term.toLowerCase();
  return (
    item.descriptionEs.toLowerCase().indexOf(term) > -1 ||
    item.keywords.filter(x => x.toLowerCase().includes(term)).length > 0
  );
}

onSearch($event){
  console.log($event);
}

trackByFn(item: Service) {
  return item.id;
}

private loadServices() {
  this.services$ = concat(
    of([]), // default items
    this.searchInput$.pipe(
      distinctUntilChanged(),
      switchMap(term => this.getService(term))
    )
  );
}

getService(term: string = null): Observable<Service[]> {
  let items = (this.services);
  if (term) {
    items = items.filter(
                x => x.descriptionEs.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
  }
  return of (items);
}






}
