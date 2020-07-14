import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../../user/models/country.model';
import { CountryService } from '../../user/services/country.service';
import { findIndex } from 'rxjs/operators';
import { LoggingService } from '@app/services/logging.service';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css']
})
export class MultiSelectComponent implements OnInit {

  hideButtons: boolean;

  countries: Country[];

  countryDivisions = []; // All Divisions of the selected country

  selectedCountry: Country;
  selectedCountryIndex: number;

  selectedCountryDivisions: number[] = []; // Divisions selected, from the selected country
  selectedByCountry: number [][];

  @Input()
  selectedDivisions: number[]; // All divisions selected, from all countries

  @Input()
  disabled = false;

  @Input()
  divisionFilter?: number[];

  @Output()
  selected = new EventEmitter<number[]>();






  countries$: Observable<Country[]>;
  constructor(
    private logger: LoggingService,
    private countryService: CountryService
    ) {
      this.hideButtons = false;

    }

  ngOnInit() {
    this.countries$ = this.countryService.countries$;
    this.countries$.subscribe(
      countries => {
        if (this.divisionFilter == null || this.divisionFilter.length === 0) {
          this.countries = countries;
        } else {
          this.countries = countries.map(country => {
           return {
              ...country,
              divisions: country.divisions.filter(item => this.divisionFilter.includes(item.id))
            };
          });
        }
        console.log(`countries => ${JSON.stringify(this.countries)}`, this.countries);
        this.selectedByCountry = [[], [], []];

        this.selectedByCountry = [
          this.selectedDivisions.filter(item => this.countries[0].divisions.findIndex(elem => elem.id === item) > -1),
          this.selectedDivisions.filter(item => this.countries[1].divisions.findIndex(elem => elem.id === item) > -1),
          this.selectedDivisions.filter(item => this.countries[2].divisions.findIndex(elem => elem.id === item) > -1),
        ];
      }
    );
  }

//   selectAll() {
//     this.selectedPeople = this.accounts;
// }

// onAdd(event) {
// this.logger.log(event);
// }

onCountrySelect(country: Country, i: number) {
  this.hideButtons = true;
  this.selectedCountry = country;
  this.selectedCountryIndex = i;
  this.countryDivisions = country.divisions;
  this.selectedCountryDivisions = [...this.selectedByCountry[i]];
}

closeModal() {
  this.selectedCountryDivisions = [];
}

onChange($event) {
  this.selectedDivisions = [...this.selectedDivisions, ...this.selectedCountryDivisions];

  this.selectedByCountry[this.selectedCountryIndex] = this.selectedCountryDivisions;

  this.selectedDivisions = [...this.selectedByCountry[0], ...this.selectedByCountry[1], ...this.selectedByCountry[2]];

  this.selected.emit(this.selectedDivisions);
}

onSave() {
  this.selectedDivisions = [...this.selectedDivisions, ...this.selectedCountryDivisions];

  this.selectedByCountry[this.selectedCountryIndex] = this.selectedCountryDivisions;

  this.selectedDivisions = [...this.selectedByCountry[0], ...this.selectedByCountry[1], ...this.selectedByCountry[2]];

  this.selected.emit(this.selectedDivisions);
}


}





