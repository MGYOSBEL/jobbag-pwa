import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CandidateProjectService } from '../services/candidate-project.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { ProjectAction, ProjectState } from '../models/project.model';
import { projectStatusToString } from '../models/mappers';
import { UserProfile } from '@app/user/models/user.model';
import { UserService } from '@app/user/services/user.service';
import { CountryService } from '@app/user/services/country.service';
import { Country } from '@app/user/models/country.model';
import { ServicesService } from '@app/user/services/services.service';
import { Service } from '@app/user/models/services.model';

@Component({
  selector: 'app-project-action-bar',
  templateUrl: './project-action-bar.component.html',
  styleUrls: ['./project-action-bar.component.css']
})
export class ProjectActionBarComponent implements OnInit {

  @Input()
  actions: ProjectAction[]; // Lista de acciones q seran mostradas en la barra

  @Input()
  statusFilter: ProjectState[]; // Estados q se mostraran en el filter status select

  @Input()
  canApply$: Observable<boolean>;

  @Input()
  divisionFilter?: number[];
  @Input()
  serviceFilter?: number[];
  @Input()
  dateFilter?: number[];

  @Output()
  selectAll = new EventEmitter<boolean>(); // Evento emitido cuando se marca el check de selectAll

  @Output()
  action = new EventEmitter<string>(); // Accion emitida desde el actionBar

  @Output()
  filters = new EventEmitter<{ // Se emite cada vez q se selecciona un filtro en el actionBar
    locations?: number[],
    services?: number[],
    date?: number,
    search?: string
  }>();

  APPLY: boolean;
  SELECTALL: boolean;
  CREATE: boolean;
  DELETE: boolean;
  selectAllCheckbox = false;
  showCU: boolean = false;

  countries$: Observable<Country[]>;
  countries: Country[];
  services: Service[];
  selectedServices: number[];
  selectedDivisionsFilter: number[] = [];
  selectedDivisions: number[];
  // userProfile: UserProfile;
  dateFilterList: string[] = [];

  constructor(
    // private userService: UserService,
    private countryService: CountryService,
    private servicesService: ServicesService
  ) {
    // const userProfile$ = combineLatest(
    //   userService.loggedUser$,
    //   userService.role$
    // );
    // userProfile$.subscribe(
    //   ([user, role]) => {
    //     this.userProfile = user.profiles.find(profile => profile.userProfileType === role);
    //   }
    // );
  }

  ngOnInit() {
    this.LocationFilterInit();
    this.servicesFilterInit();
    this.dateFilterInit();
    this.SELECTALL = this.actions.includes(ProjectAction.SelectAll);
    this.APPLY = this.actions.includes(ProjectAction.Apply);
    this.CREATE = this.actions.includes(ProjectAction.Create);
    this.DELETE = this.actions.includes(ProjectAction.Delete);


  }

  onSelectAll(event) {
    this.selectAll.emit(event.target.checked);
  }

  onAction(event: string) {
    switch (event) {
      case 'APPLY':
        this.action.emit(ProjectAction.Apply);
        break;
      case 'CREATE':
        this.action.emit(ProjectAction.Create);
        break;
      case 'SELECTALL':
        this.action.emit(ProjectAction.SelectAll);
        break;
      case 'DELETE':
        this.action.emit(ProjectAction.Delete);
        break;
      default:
        break;
    }
  }

  statusStringify(status: ProjectState): string {
    return projectStatusToString(status);
  }

  onStatusFilter(event) {
    const statusFilters = event.target.value;
    this.selectAll.emit(false);
    this.selectAllCheckbox = false;
  }

  onLocationFilterChange($event) {
    this.filters.emit({ locations: this.selectedDivisions });
  }

  onSearchChange(event) {
    this.filters.emit({ search: event.target.value });
  }

  onDivisionsSelect(event) {
    this.selectedDivisionsFilter = event.map(elem => elem.id);
  }

  LocationFilterInit() {
    this.countries$ = this.countryService.countries$;
    this.countries$.subscribe(
      countries => {
        if (this.divisionFilter == null || this.divisionFilter.length === 0) {
          this.countries = countries;
        } else {
          this.selectedDivisions = this.divisionFilter;
          this.countries = countries.map(country => {
            return {
              ...country,
              divisions: country.divisions.filter(item => this.divisionFilter.includes(item.id))
            };
          }).filter(country => country.divisions.length > 0);
        }
      }
    );

  }

  servicesFilterInit() {
    this.servicesService.services$.subscribe(
      services => {
        if (this.divisionFilter == null || this.divisionFilter.length === 0) {
          this.services = services;
        } else {
          this.selectedServices = this.serviceFilter;
          this.services = services.filter(service => this.serviceFilter.includes(service.id));
        }
      }
    );
  }

  dateFilterInit() {
    if (!!this.dateFilter) {
      this.dateFilter.forEach(date => {
        this.dateFilterList.push(this.mapMonthsToString(date));
      }
      );
    }
  }

  mapMonthsToString(months: number): string {
    switch (months) {
      case 1:
        return 'Last month';
      case 12:
        return 'Last year';
      default:
        return `Last ${months} months`;
    }
  }

  customSearchFn(term: string, item: Service) {
    term = term.toLowerCase();
    return (
      item.descriptionEs.toLowerCase().indexOf(term) > -1 ||
      item.keywords.filter(x => x.toLowerCase().includes(term)).length > 0
    );
  }

  onServiceFilterChange() {
    this.filters.emit({ services: this.selectedServices });
  }

  onDateFilterChange(event) {
    const index = this.dateFilterList.findIndex(elem => elem === event);
    const value = this.dateFilter[index];
    this.filters.emit({date: value});
  }

}
